<?php

namespace Iceman;

require_once __DIR__ . '/utils.php';

class File {

    private $name = '';
    private $type = '';
    private $tmp_name = '';
    private $path = '';
    private $error = false;
    private $size = 0;

    private $saved = false;

    private function __construct ($name = null, $file = null, $mime = null) {
        if (!($name && $file && $mime))
            return $this->error = true;
        $this->name = $name;
        foreach ($file as $key => $value) {
            $this->$key = $value;
        }
        $this->error = false;
        $this->type = $mime;
    }

    private static function checkError ($name, $file) {
        if (!(isset($name) && isset($file)) || !isset($file['error']) || is_array($file['error']))
            return false;
        if ($file['error'] !== UPLOAD_ERR_OK)
            return false;
        if ($file['size'] > 5e5)
            return false;
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        if (!($ext = array_search(
                $finfo->file($file['tmp_name']),
                [
                    'jpg' => 'image/jpg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'svg' => 'text/plain',
                ],
                true
        )))
            return false;
        return $ext;
    }

    public function save ($dir = 'dist') {
        if ($this->saved)
            return;
        $id = uniqid('camagru_', true);
        $filename = sha1($id);
        $upload_dir = __DIR__ . "/../$dir";
        if (!is_dir($upload_dir)) {
            @unlink($upload_dir);
            @mkdir($upload_dir);
        }
        $this->path = $upload_dir . "/$filename";
        $this->saved = @move_uploaded_file($this->tmp_name, $this->path);
    }

    public function isValid () {
        return $this->error;
    }

    public function path () {
        return $this->path;
    }

    public function extension() {
        return $this->type;
    }

    public static function create ($name, $file) {
        if (($mime = self::checkError($name, $file)) !== false)
            return new self($name, $file, $mime);
        return new self;
    }

}
