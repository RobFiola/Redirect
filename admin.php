<?php
    session_start();
    if(!isset($_SESSION['login'])) {
        header('LOCATION:login.php'); die();
    }
?>
<!DOCTYPE html>
<html>
<head>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="src/java.js"></script>
<link rel="stylesheet" type="text/css" href="src/styles.css">
</head>
<body>
    
    
    <table id='table'>
        <tr>
          <td>#</td>
           <td>ROOT URL</td>
            <td>ProductSKU</td>
            <td>Keyword</td>
            <td>Redirect To</td>
            <td>Delete</td>
        </tr>
        <tr id='0'>
            <td>0</td>
            <td id="root0"><input type="text" value="product1.opendoordeals.com"></td>
            <td id="label0"><input type="text" value="98d" maxlength="15"></td>
            <td id="keyword0"><input type="text" value='product'></td>
            <td id="super0" ><input  value="amzworldwide"></td>
            <td id="delete0" class='delete' onclick="deleteItem(this.parentElement)">X</td>


        </tr>

    </table>
    
    <div class="buttons">
        <button class="add" onclick="addItem()">Add</button>
        <button class="update" onclick="save()">Update</button>
    </div>
</body>
</html>
