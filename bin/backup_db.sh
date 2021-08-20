echo $CIE_PROD_DB_HOST
mysqldump -p -h $CIE_PROD_DB_HOST -u$CIE_PROD_DB_USER --all-databases 
