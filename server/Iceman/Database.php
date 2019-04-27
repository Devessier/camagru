<?php

namespace Iceman;

require_once __DIR__ . '/../../config/setup.php';

interface DatabaseOperations {

    public static function select (string $query, array $params);
    public static function insert (string $query, array $params);
    public static function update (string $query, array $params);
    public static function delete (string $query, array $params);

}

class DB implements DatabaseOperations {

    public  static  $error = false;
    private static  $connection = null;

	public static function connect () {
        if (self::$connection === null) {
            try {
                self::$connection = new \PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
                self::$connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                self::$error = true;
            }
        }
        return true;
    }

    public static function select (string $query, array $params = []) {
        if (self::$error)
            throw new \Exception("The connection with the DB isn't established.");
        $stmt = self::prepare($query, $params);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public static function insert (string $query, array $params = []) {
        if (self::$error)
            throw new \Exception("The connection with the DB isn't established.");
        $stmt = self::prepare($query, $params);
        $stmt->execute();
    }

    public static function update (string $query, array $params = []) {
        if (self::$error)
            throw new \Exception("The connection with the DB isn't established.");
        $stmt = self::prepare($query, $params);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public static function delete (string $query, array $params = []) {
        return self::update($query, $params);
    }

    private static function &prepare (string $query, array $params) {
        if (!($paramsType = arrayType($params)))
            throw new \Exception('Bad parameters array');

        $stmt = self::$connection->prepare($query);

        foreach ($params as $key => &$value) {
            $stmt->bindParam(
                is_numeric($key) ? $key + 1 : ":$key",
                $value,
                self::paramType($value)
            );
        }

        return $stmt;
    }

    private static function paramType ($param) {
        if (is_numeric($param))
            return \PDO::PARAM_INT;
        if (is_string($param))
            return \PDO::PARAM_STR;
        if (is_bool($param))
            return \PDO::PARAM_BOOL;
        if (is_null($param))
            return \PDO::PARAM_NULL;
        return 0;
    }

}
