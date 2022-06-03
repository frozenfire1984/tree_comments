<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

try {
    if (isset($_POST["comment_id"])) {
        $owner = $_POST["comment_id"];
    }

    $author = "anonimus";
    if (isset($_POST["comment_author"])) {
        $author = trim(stripslashes($_POST["comment_author"]));
    }
    
    $body = "";
    if (isset($_POST["comment_value"])) {
        $body = trim(stripslashes($_POST["comment_value"]));
    }

    $time = 0;
    if (isset($_POST["time"])) {
        $time = $_POST["time"];
    }

    require_once("connect.php");
    $sql = "INSERT INTO comments (id, owner, author, body, time) VALUES (NULL, NULLIF('$owner',''), '$author', '$body', '$time')";
    $result = mysqli_query($link, $sql);

    sleep(2); //simulate network delay

    if ($result) {
        $data = array(
            'id' => mysqli_insert_id($link)
        );
        echo json_encode($data);

    } else {
        throw new Exception("insert to bd failed!");
    }

} catch (Exception $e) {
    $data_error = array(
        'error' => $e->getMessage()
    );
    echo json_encode($data_error);
}
?>