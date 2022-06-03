<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

try {
    
    if (isset($_POST["comment_id"])) {
        $id = $_POST["comment_id"];
    }
    
    $body = "";
    if (isset($_POST["comment_value_editing"])) {
        $body = trim(stripslashes($_POST["comment_value_editing"]));
    }

    $time = 0;
    if (isset($_POST["time_updated"])) {
        $time = $_POST["time_updated"];
    }

    require_once("connect.php");
    $sql = "UPDATE comments SET body = '$body', time_updated = '$time' WHERE id = $id";
    $result = mysqli_query($link, $sql);

    sleep(2); //simulate network delay

    if ($result) {

        $data = array(
            'result' => 'ok'
        );
        echo json_encode($data);

    } else {
        throw new Exception("update comment with id=$id failed!");
    }

} catch (Exception $e) {
    $data_error = array(
        'error' => $e->getMessage()
    );
    echo json_encode($data_error);
}
?>