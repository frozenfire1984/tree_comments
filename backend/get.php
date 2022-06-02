<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

try {
    require_once("connect.php");
    
    $sql = "SELECT * FROM comments";
    $result = mysqli_query($link, $sql);

    if ($result) {
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        sleep(2); //simulate network delay
        $data = array(
            'comments' => $rows
        );
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception("select from bd failed!");
    }

} catch (Exception $e) {
    $data_error = array(
        'error' => $e->getMessage()
    );
    echo json_encode($data_error);
}
?>