<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

use Iceman\Image;
use Iceman\Filter;

class PostController {

    private const MAX_HEIGHT = 480;
    private const MAX_WIDTH = 680;

    public static function file (Request $request) {
        [ 'file' => $file ] = $request->body();

        echo "file\n";
    }

    public static function photo (Request $request) {
        try {
            DB::connect();

            $body = $request->body();

            $photo = $body->photo;
            $message = $body->message;

            $filter_arr = [
                'name' => $body->filter_name,
                'width' => (int)$body->filter_width,
                'height' => (int)$body->filter_height,
                'x' => (int)$body->filter_x,
                'y' => (int)$body->filter_y
            ];

            if (!(
                $photo
                && $message
                && strlen($message) <= 120
                && array_every($filter_arr, function ($item) { return isset($item); })
                && ($filter_arr['x'] + $filter_arr['width']) <= self::MAX_WIDTH
                && ($filter_arr['x'] + $filter_arr['width']) >= 0
                && ($filter_arr['y'] + $filter_arr['height']) <= self::MAX_HEIGHT
                && ($filter_arr['y'] + $filter_arr['height']) >= 0)) {
                return Response::badRequest();
            }

            $filter = Filter::fromName($filter_arr['name'], $filter_arr);
            $image = Image::fromBase64($photo);

            if (!($filter && $image)) {
                return Response::badRequest();
            }

            if (!$filter->superposeTo($image, $filter_arr['x'], $filter_arr['y'], $filter_arr['width'], $filter_arr['height'])) {
                return Response::internalError();
            }

            if (!($path = $image->saveTo('images', 'png'))) {
                return Response::internalError();
            }

            $imageID = DB::insert('INSERT INTO images(path) VALUES(?)', [
                $path
            ]);
            
            DB::insert('INSERT INTO posts(user_id, img_id, text) VALUES(:user_id, :img_id, :text)', [
                'user_id' => $request->session('id'),
                'img_id' => $imageID,
                'text' => $message
            ]);

            imagedestroy($filter->content());
            imagedestroy($image->content());

            return Response::make()
                    ->json([
                        'path' => $path
                    ]);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function fetch (Request $request, $id) {
        try {
            DB::connect();

            if ($id === null) {
                $query = <<<EOT
                    SELECT
                        posts.id,
                        posts.text AS comment,
                        posts.created_at AS createdAt,
                        images.path AS url,
                        users.id AS author_id,
                        users.username AS author_username,
                        likes.liked
                    FROM
                        posts
                    INNER JOIN
                        images
                    ON
                        posts.img_id = images.id
                    INNER JOIN
                        users
                    ON
                        users.id = posts.user_id
                    LEFT JOIN
                        likes
                    ON
                        likes.user_id = :user_id AND likes.post_id = posts.id
                    ORDER BY
                        posts.created_at DESC
                    LIMIT :limit
EOT;
            } else {
                $query = <<<EOT
                    SELECT
                        posts.id,
                        posts.text AS comment,
                        posts.created_at AS createdAt,
                        images.path AS url,
                        users.id AS author_id,
                        users.username AS author_username,
                        likes.liked
                    FROM
                        posts
                    INNER JOIN
                        images
                    ON
                        posts.img_id = images.id
                    INNER JOIN
                        users
                    ON
                        users.id = posts.user_id
                    LEFT JOIN
                        likes
                    ON
                        likes.user_id = :user_id AND likes.post_id = posts.id
                    WHERE
                        posts.id < :id
                    ORDER BY
                        posts.created_at DESC
                    LIMIT :limit
EOT;
            }

            $userId = $request->session('id');

            $limit = 5;

            $args = [
                'limit' => $limit,
                'user_id' => $userId ?? -1
            ];

            if ($id !== null) $args['id'] = $id;

            $posts = DB::select($query, $args);

            foreach ($posts as &$post) {
                $comments = DB::select('SELECT comments.comment_id AS id, comments.created_at AS createdAt, comments.text AS text, users.username, user_id FROM comments INNER JOIN users ON users.id = comments.user_id WHERE post_id = :id ORDER BY comments.created_at ASC', [
                    'id' => $post['id']
                ]);

                foreach ($comments as &$comment) {
                    $comment['user'] = [
                        'id' => $comment['user_id'],
                        'name' => $comment['username'],
                        'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                    ];

                    unset($comment['username'], $comment['user_id']);
                }

                $post['user'] = [
                    'id' => (int)$post['author_id'],
                    'name' => $post['author_username'],
                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                ];

                $post['id'] = (int)$post['id'];

                $post['liked'] = $post['liked'] == 1 ? true : false;

                unset($post['author_id'], $post['author_username']);

                $post['comments'] = $comments ?? [];
            }

            return Response::make()
                    ->json($posts);
        } catch (\Exception $e) {
            print_r($e);
            return Response::internalError();
        }
    }

    public static function loadMore (Request $request, string $id) {
        if (!((int)$id > 0)) return Response::make()->json([]);

        return self::fetch($request, $id);
    }

    public static function load (Request $request) {
        return self::fetch($request, null);
    }

    public static function like (Request $request, $postId, $state) {
        try {
            if (empty($postId) || empty($state))
                return Response::badRequest();
            if (!($userId = $request->session('id')))
                return Response::unauthorized();

            $liked = $state === 'like';

            $query = <<<EOT
                INSERT INTO likes
                    (user_id, post_id, liked)
                VALUES
                    (:user_id, :post_id, :liked)
                ON DUPLICATE KEY
                    UPDATE liked = :liked
EOT;

            DB::connect();

            DB::insert($query, [
                'user_id' => $userId,
                'post_id' => $postId,
                'liked' => $liked
            ]);

            $getPostAuthorQuery = <<<EOT
                SELECT
                    posts.text,
                    users.email,
                    users.username,
                    users.wants_notifications
                FROM
                    posts
                INNER JOIN
                    users
                ON
                    posts.user_id = users.id
                WHERE
                    posts.id = :post_id
EOT;

            if ($state === 'like') {
                $data = DB::select($getPostAuthorQuery, [
                    'post_id' => $postId
                ]);

                if (!empty($data) && !empty($data[0]) && !empty($data['wants_notifications']) && $data['wants_notifications'] === true) {
                    [ 'text' => $text, 'email' => $email, 'username' => $username ] = $data[0];

                    // Notify the user
                    MailController::postHasBeenLiked($username, $email, $text);
                }
            }

            return Response::make()
                    ->json(true);
        } catch (\Exception $e) {
            return Response::internalError();
        }
        
    }

    public static function comment (Request $request, $postId) {
        try {
            if (empty($postId))
                return Response::internalError();
            if (!($userId = $request->session('id')))
                return Response::unauthorized();

            $body = $request->body();

            if (!($comment = $body->comment) || $comment === '')
                return Response::badRequest();

            DB::connect();

            DB::insert('INSERT INTO comments(text, user_id, post_id) VALUES(:text, :user_id, :post_id)', [
                'text' => $comment,
                'user_id' => $userId,
                'post_id' => $postId
            ]);

            $query = <<<EOT
                SELECT
                    post_author.id AS "author_id",
                    post_author.username AS "username",
                    post_author.email AS "email",
                    post_author.wants_notifications AS "author_wants_notifications",
                    posts.text AS "post_text",
                    comment_author.username AS "comment_author"
                FROM
                    posts
                INNER JOIN
                    users AS post_author
                ON
                    post_author.id = posts.user_id
                INNER JOIN
                    users AS comment_author
                ON
                    comment_author.id = :comment_author_id
                WHERE
                    posts.id = :post_id
EOT;

            $data = DB::select($query, [
                'comment_author_id' => $userId,
                'post_id' => $postId
            ]);

            if (!empty($data) && !empty($data[0])) {
                [
                    'author_id' => $authorId,
                    'username' => $username,
                    'email' => $email,
                    'post_text' => $postText,
                    'comment_author' => $commentAuthor,
                    'author_wants_notifications' => $authorWantsNotifications
                ] = $data[0];

                echo "authorWantsNotifications =" . $authorWantsNotifications . "\n";

                if (!empty($authorId) && $authorId !== $userId && $authorWantsNotifications === true) {
                    // Notify the post author that its post has received a new comment
                    // if the commenter is not the author of the comment.
                    MailController::postHasBeenCommented(
                        $username,
                        $email,
                        $postText,
                        $commentAuthor,
                        $comment
                    );
                }
            }
            return Response::make()->json(true);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

}
