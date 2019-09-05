<?php

namespace Iceman;

include_once __DIR__ . '/../../config/setup.php';

$GLOBALS['DB_DSN'] = $DB_DSN;
$GLOBALS['DB_USER'] = $DB_USER;
$GLOBALS['DB_PASSWORD'] = $DB_PASSWORD;

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
        global $DB_DSN, $DB_USER, $DB_PASSWORD;

        if (self::$connection === null) {
            try {
                self::$connection = new \PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
                self::$connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                self::$error = true;
                throw $e;
            }
        }
    }

    public static function select (string $query, array $params = []) {
        self::canMakeRequest();
        $stmt = self::prepare($query, $params);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public static function insert (string $query, array $params = []) {
        self::canMakeRequest();
        $stmt = self::prepare($query, $params);
        $stmt->execute();
        return self::$connection->lastInsertId();
    }

    public static function update (string $query, array $params = []) {
        self::canMakeRequest();
        $stmt = self::prepare($query, $params);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public static function delete (string $query, array $params = []) {
        self::canMakeRequest();
        return self::update($query, $params);
    }

    public static function statement (string $query, array $params = []) {
        self::canMakeRequest();
        $stmt = self::prepare($query, $params);
        $stmt->execute();
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

    private static function canMakeRequest () {
        if (self::$error || self::$connection === null)
            throw new \Exception("Error, it's impossible to make a request to DB");
    }

}
