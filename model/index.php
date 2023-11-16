<?php

namespace Model;

$pathName = realpath(__DIR__ . "/..");
require_once "$pathName/config/database/init.php";
require_once "$pathName/model/GlobalMethods.php";

use TraitMethods\GlobalMethods;
use Db\InitDb;
use Exception;

abstract class IndexModel extends InitDb
{

  use GlobalMethods;
  public $modelName;
  private $symbols = [
    "equal" => "=",
    "different" => "!=",
    "like" => "LIKE",
  ];
  private $sequences = [
    "and" => "AND",
  ];

  public $statements = [];

  public function __construct($modelName, $statements)
  {
    parent::__construct(null);
    $this->modelName = $modelName;
    $this->statements = $statements;
  }

  private function find($params = null)
  {
    $select = fn ($val) => "SELECT $val FROM $this->modelName";

    if ($params == null) {
      return [
        "query" => $select("*"),
        "isWhereSet" => false,
      ];
    }

    ["values" => $values, "where" => $where] = $this->_filterExpectedValues(
      $params,
      "values",
      "where"
    );
    $newValues = $this->setValuesToQuery($values);
    $newWhere = $this->setWhereStatementToQuery($where);

    if (isset($newWhere)) {
      $newWhere = " WHERE $newWhere";
    }

    return [
      "query" => $select($newValues) . $newWhere,
      "isWhereSet" => isset($newWhere),
    ];
  }

  public function findAll($params = null, $getQuery = false, $closeConnection = true)
  {
    ["query" => $query] = $this->find($params);
    $returnValue = $query;
    if (!$getQuery) {
      $returnValue = $this->getConnection()->query($query);
      if ($closeConnection) {
        $this->closeConnection();
      }
    }

    return $returnValue;
  }

  public function findById($id, $params = null, $getQuery = false, $closeConnection = true)
  {

    ["query" => $query, "isWhereSet" => $isWhereSet] = $this->find($params);

    $idParam = empty($isWhereSet) ? " WHERE id = $id" : " AND id = $id";

    $newQuery = $query . $idParam . " LIMIT 1";
    $returnValue = $newQuery;
    if (!$getQuery) {
      $returnValue = $this->getConnection()->query($query);
      $returnValue = $returnValue->fetch_assoc();
      if ($closeConnection) {
        $this->closeConnection();
      }
    }
    return $returnValue;
  }

  public function findOne($params = null, $getQuery = false, $closeConnection = true)
  {
    ["query" => $query] = $this->find($params);

    $newQuery = $query . " LIMIT 1";
    $returnValue = $newQuery;
    if (!$getQuery) {
      $result = $this->getConnection()->query($newQuery);
      $returnValue = $result->fetch_assoc();
      if ($closeConnection) {
        $this->closeConnection();
      }
    }

    return $returnValue;
  }

  public function create($data, $getQuery = false, $closeConnection = true)
  {

    $keys = "";
    $values = "";

    foreach ($data as $key => $value) {
      $newKey = $this->_isNestedKeyExists($this->statements, $this->toUpperCase($key));
      if (empty($newKey)) {
        continue;
      }

      $keys .= "$newKey, ";
      $values .= is_string($value) ? "'$value', " : "$value, ";
    }

    if (empty($keys) || empty($values)) {
      return false;
    }

    $values = substr($values, 0, -2);
    $keys = substr($keys, 0, -2);

    $query = "INSERT INTO $this->modelName ($keys) VALUES ($values)";
    $returnValue = $query;

    if (!$getQuery) {
      $returnValue = $this->getConnection()->query($query);
      if ($closeConnection) {
        $this->closeConnection();
      }
    }
    return $returnValue;
  }

  public function delete($params, $closeConnection = true)
  {
    ["where" => $where] = $this->_filterExpectedValues(
      $params,
      "where",
    );

    $newWhere = $this->setWhereStatementToQuery($where);

    $query = "DELETE FROM $this->modelName" . (empty($newWhere) ? "" : " WHERE $newWhere");

    $isDeleted = $this->getConnection()->query($query);
    if ($closeConnection) {
      $this->closeConnection();
    }

    return $isDeleted;
  }

  public function createAndGet($fieldSelector, $data, $closeConnection = true)
  {
    $conn = $this->getConnection();
    $conn->begin_transaction();
    $result = [];
    $hasError = false;
    try {

      $createQuery = $this->create($data, true);
      $conn->query($createQuery);

      $lastInsertId = "";
      if (empty($fieldSelector) || !isset($data[$fieldSelector])) {
        $lastInsertId = $conn->insert_id;
      } else {
        $lastInsertId = $data[$fieldSelector];
      }
      $selectQuery = $this->findOne([
        "where" => [
          $fieldSelector => [$lastInsertId, "equal"],
        ],
      ], true);

      $result = $conn->query($selectQuery);
      $result = $result->fetch_assoc();

      $conn->commit();
    } catch (Exception $e) {
      $conn->rollback();
      $hasError = true;
    }

    if ($closeConnection) {
      $this->closeConnection();
    }

    return [
      "hasError" => $hasError,
      "result" => $result,
    ];
  }

  public function bulkCreate($params, $getQuery = false, $closeConnection = true)
  {
    ["keys" => $keys, "values" => $values, "global" => $global] = $this->_filterExpectedValues(
      $params,
      "keys",
      "values",
      "global"
    );

    $newNestedValues = "";
    $newKeys = "";
    foreach ($values as $nestValues) {
      $newValues = "";
      foreach ($nestValues as $value) {
        $newValues .= is_string($value) ? "'$value', " : "$value, ";
      }

      if ($global != null) {
        foreach ($global as $key => $value) {
          $newValues .= is_string($value) ? "'$value', " : "$value, ";
        }
      }
      $newValues = substr($newValues, 0, -2);
      $newNestedValues .= "($newValues), ";
    }

    foreach ($keys as $key) {
      $newKey = $this->_isNestedKeyExists($this->statements, $key);
      if (empty($newKey)) {
        return false;
      }

      $newKeys .= "$newKey, ";
    }

    if ($global != null) {
      foreach ($global as $key => $value) {
        $newKeys .= "$key, ";
      }
    }

    $newKeys = substr($newKeys, 0, -2);
    $newNestedValues = substr($newNestedValues, 0, -2);

    $query = "INSERT INTO $this->modelName($newKeys) VALUES $newNestedValues";

    $returnValue = $query;

    if (!$getQuery) {
      $returnValue = $this->getConnection()->query($query);
      if ($closeConnection) {
        $this->closeConnection();
      }
    }
    return $returnValue;
  }

  public function exists($params, $closeConnection = true)
  {
    $query = $this->findOne($params, true, false);
    $existResult = false;

    $exec = $this->getConnection()->query($query);

    if (isset($exec->num_rows) && $exec->num_rows > 0) {
      $existResult = true;
    }

    if ($closeConnection) {
      $this->closeConnection();
    }

    return $existResult;
  }

  // public function join (IndexModel $instance, $joinInstanceWith, $valuesCallback, $params = null) {

  //     ["where" => $where] = $this->_filterExpectedValues(
  //         $params,
  //         "values",
  //         "where"
  //     );
  //     ["instance1" => $instance1, "instance2" => $instance2] = $valuesCallback($instance->modelName, $this->modelName);

  //     function iterator ($value, $instance) {
  //         ["value" =>] = $instance;
  //         return "$instance.$value";
  //     }

  //     $instance1Values = array_map(function ($value) use ($instance1) {
  //         return "$instance1.$value";
  //     },
  //     $instance1);
  //     $newWhere = "";
  //     if (isset($where)) {
  //         $newWhere = " WHERE $where";
  //     }

  //     $query = "SELECT $newValues FROM  md1 INNER JOIN $instance->modelName md2"
  //     .
  //     " ON md1.id = md2.$joinInstanceWith" . $newWhere;

  //     return $query;
  // }

  public function transaction($callback, $closeConnection = true)
  {
    $newConn = $this->getConnection();
    $newConn->begin_transaction();

    $isOk = true;

    $rollback = function () use ($newConn, &$isOk) {
      $newConn->rollback();
      $isOk = false;
    };

    try {
      $callback($rollback);
    } catch (Exception $e) {
      $newConn->rollback();
      $isOk = false;
    }

    if ($closeConnection) {
      $this->closeConnection();
    }

    return $isOk;
  }

  public function createWith(...$queries)
  {
    $this->getConnection()->begin_transaction();
    $isInserted = true;
    try {
      foreach ($queries as $query) {
        $this->getConnection()->query($query);
      }
      $this->getConnection()->commit();
    } catch (Exception $e) {
      $isInserted = false;
      $this->getConnection()->rollback();
    }

    $this->getConnection()->close();
    return $isInserted;
  }

  public function update($params, $getQuery = false)
  {

    ["where" => $where, "set" => $sets] = $this->_filterExpectedValues(
      $params,
      "where",
      "set"
    );

    $updateSet = "";

    foreach ($sets as $key => $set) {
      $newKey = $this->_isNestedKeyExists($this->statements, $key);

      if (empty($newKey)) {
        continue;
      }

      $newSet = is_string($set) ? "'$set'" : $set;
      $updateSet .= "$newKey = $newSet, ";
    }
    $newWhere = $this->setWhereStatementToQuery($where);
    $updateSet = substr($updateSet, 0, -2);

    $newWhere = isset($newWhere) ? " WHERE $newWhere" : "";

    $query = "UPDATE $this->modelName SET $updateSet" . $newWhere;
    $returnValue = $query;

    if (!$getQuery) {
      $returnValue = $this->getConnection()->query($query);
      $this->closeConnection();
    }
    return $returnValue;
  }

  private function setValuesToQuery($values)
  {

    if (empty($values) || !isset($values) || count($values) <= 0) {
      return "*";
    }

    $valuesToString = "";

    foreach ($values as $value) {
      $valuesToString .= "$value, ";
    }
    return substr($valuesToString, 0, -2);
  }

  private function setWhereStatementToQuery($where = null)
  {
    if (empty($where) || !isset($where) || count($where) <= 0 || $where == null) {
      return "";
    }

    $whereToString = '';

    foreach ($where as $key => $value) {
      [$statement, $symbol, $sequence] = $this->_getExpectedValues($value, 3);
      $newSymbol = $this->_isNestedKeyExists($this->symbols, $symbol);
      $newStatement = $this->_isNestedKeyExists($this->statements, $this->toUpperCase($key));
      $newSequence = $this->_isNestedKeyExists($this->sequences, $sequence);

      $setSequence = isset($newSequence) ? " $newSequence " : " ";

      $whereToString .= "$newStatement $newSymbol '$statement'" . $setSequence;
    }

    return substr($whereToString, 0, -1);
  }

  public function in($data = [])
  {
    $value = "(";

    if (empty($data) || count($data) == 0) return null;

    foreach ($data as $v) {
      $value .= is_string($v) ? "'$v', " : "$v, ";
    }

    return substr($value, 0, -2) . ")";
  }
}
