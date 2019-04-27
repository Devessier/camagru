<?php

use Iceman\DB;

class UserController {

	public function test () {
        DB::connect();

        try {
            DB::insert('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [ 'FJKHDFKJS', sha1('JKJHFDSF'), 'test@example.fr' ]);
            echo "after";
            print_r(DB::select('SELECT * FROM users'));
        } catch (\Exception $e) {}
	}

}
