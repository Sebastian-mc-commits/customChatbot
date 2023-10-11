
<?php

class InitDb {
    private $defaultDatabase = "chatbot";
    private $host = 'localhost';
    private $username = 'root';
    private $password = '98757682';
    private $instance;
    public $database = "";

    public function __construct($database = null)
    {
        if ($database == null) {
            $database = $this->defaultDatabase;
        }

        $this->database = $database;
        $this->instance = new mysqli($this->host, $this->username, $this->password, $this->database);
    }

    public function getConnection() {
        $conn = $this->instance;

        if ($conn->connect_error) {
            die("La conexion ha fallado");
        }

        return $conn;
    }
}
