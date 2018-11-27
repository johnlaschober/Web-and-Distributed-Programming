<?php
   $json = $_POST['json'];

   if (json_decode($json) != null)
   {
     $file = fopen('contact_data.json','w+');
     fwrite($file, $json);
     fclose($file);
   }
?>