<?php

$action = $_REQUEST['action'];


if(!empty($action)){
    require_once 'includes/Player.php';
    $obj = new Player();
}


if($action == 'adduser' && !empty($_POST)){
    $pname = $_POST['username'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $photo= $_FILES['photo'];
    $id = (!empty($_POST['userid'])) ? $_POST['userid'] : '';

    //validation file upload
    $imagename = '';
    if(!empty($photo['name'])){
        $imagename = $obj->uploadImage($photo);
        $data = [
            'pname' => $pname,
            'email' => $email,
            'phone' => $phone,
            'photo' => $imagename,
        ];
    }else{
        $data = [
            'pname' => $pname,
            'email' => $email,
            'phone' => $phone,
        ];
    }

    //print_r($data);
    if($id){
        $obj->update($data, $id);
    }else{
        $id = $obj->add($data);
    }


    if(!empty($id)){
        $player = $obj->getRow('id', $id);
        echo json_encode($player);
        exit;
    } 

}

if($action == 'getusers'){

    $page = (!empty($_GET['page']))? $_GET['page'] : 1;
    $limit = 4;
    $start = ($page - 1) * $limit;
    $players = $obj->getRows($start, $limit);
    if(!empty($players)){
        $playerslist = $players;

    }else{
        $playerslist = [];
    }
    $total = $obj->getCount();
    $PlayersArr = ['count'=> $total, 'players'=>$playerslist];
    echo json_encode($PlayersArr);
    exit();
}

if($action == 'getuser'){

    $id=(!empty($_GET['id'])) ? $_GET['id'] : '';

    if(!empty($id)){
        $player = $obj->getRow('id', $id);
        echo json_encode($player);
        exit();
    }

}


if($action == 'deleteuser'){

    $id=(!empty($_GET['id'])) ? $_GET['id'] : '';

    if(!empty($id)){
        $isDelete = $obj->deleteRow($id);
        if($isDelete){
            $message = ['delete'=>1];
        }else{
            $message = ['delete'=>0];
        }
        echo json_encode($message);
        exit();
    }

}

if($action == 'search'){

    $queryString = (!empty($_GET['searchQuery'])) ? $_GET['searchQuery'] : '';
    $results = $obj->search($queryString);
    echo json_encode($results);

}
