<?php 
require_once 'Database.php';
class Player extends Database
{

    protected $tableName = 'players';
    
    /**
     * function used to add record
     * @param array data
     * @return $lastInsertId 
     */

    public function add($data)
    {
        if(!empty($data)){
            $fields = $placeholder = [];
            foreach($data as $field => $value){
                $fields[] = $field;
                $placeholder[] = ":{$field}";
            }
        }
        $sql = "INSERT INTO {$this->tableName} (".implode(',', $fields).") VALUES (".implode(',', $placeholder).")";
        $stmt = $this->conn->prepare($sql);
        try{
            $this->conn->beginTransaction();
            $stmt->execute($data);
            $lastInsertId = $this->conn->lastInsertId();
            $this->conn->commit();
            return $lastInsertId;
        }catch(PDOException $e){

            echo "Error: ".$e;
            $this->conn->rollBack();

        }
    }


    public function update($data, $id)
    {
        if(!empty($data)){
            $fields = "";
            $x = 1;
            $fileCount = count($data);
            foreach($data as $field => $value){
                $fields .= "{$field} = :{$field}";
                if($x < $fileCount){
                  $fields .= ", ";  
                }
                $x++;
            }
        }
        $sql = "UPDATE {$this->tableName} SET  $fields WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        try{
            $data['id'] = $id;
            $this->conn->beginTransaction();
            $stmt->execute($data);
            $this->conn->commit();
            
        }catch(PDOException $e){

            echo "Error: ".$e;
            $this->conn->rollBack();

        }

    }


    /**
     * funtion used to get records
     * @param int $start
     * @param int $limit
     * @return array $results
     * 
     */

    public function getRows($start=0, $limit=4)
    {
        $sql = "SELECT * FROM {$this->tableName} LIMIT {$start},{$limit}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        if($stmt->rowCount()>0){
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $results = [];
        }
        return $results;

    }


      /**
     * funtion used to count records
     * @param int $start
     * @param int $limit
     * @return array $results
     * 
     */

    public function getCount()
    {
        $sql = "SELECT count(*) as total FROM {$this->tableName}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'];

    }


    /**
     * funtion is used to get sigle record based on one colum value
     * @param string $field
     * @param any $value
     * @return array $return
     */
    
    public function getRow($field, $value)
    {
        $sql = "SELECT * FROM {$this->tableName} WHERE {$field}=:{$value}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([":{$value}"=> $value]);
        if($stmt->rowCount()>0){
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        }else{
            $result = [];
        }

        return $result;
    }


     /**
     * funtion is used to delete row by id
     * @param int $id
     * @return boolean true|false
     */
    
    public function deleteRow($id)
    {
        $sql = "DELETE FROM {$this->tableName} WHERE id=:{$id}";
        $stmt = $this->conn->prepare($sql);
      
        try{
            $stmt->execute([":{$id}"=> $id]);
            //$stmt->execute([":id"=> $id]);
            if($stmt->rowCount()>0){
                return true;
            }
        }catch(PDOException $e){
            echo 'Error: '.$e->getMessage();
            return false;
        }
     
           
        }
  

    /**
     * funtion is used to upload file image
     * @param array $file
     * @return string $newFileName
     */

    public function uploadImage($file)
    {
        if(!empty($file)){

            $fileTempPath = $file['tmp_name'];
            $fileName = $file['name'];
            $fileSize =$file['size'];
            $fileNameCmps = explode('.', $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            $newFileName = md5(time().$fileName).'.'.$fileExtension;
            $allowedExtn = ["jpg", "png", "jpeg", "gif"];
            if(in_array($fileExtension, $allowedExtn)){
                $uploadFileDir = getcwd().'/uploads/';
                $destFilePath = $uploadFileDir.$newFileName;
                    if(move_uploaded_file($fileTempPath, $destFilePath)){
                        return $newFileName;
                    }
            }
        }
    }

    public function search($textSeach, $start = 0, $limit = 4)
    {
        $sql = "SELECT * FROM {$this->tableName} WHERE pname LIKE :search ORDER BY id DESC LIMIT {$start} , {$limit}";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([ ":search" => "{$textSeach}%"]);
        if($stmt->rowCount()>0){
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $results = [];
        }
        return $results;
    }


}