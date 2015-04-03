## ------ START:  UserData:   Setup - .s3cfg file (the S3 configuration) ------ ##
sudo sed -i -r "s/(access_key *= *).*/\1$S3_DEPLOYMENT_KEY/" /home/ubuntu/.s3cfg
sudo sed -i -r "s/(secret_key *= *).*/\1$S3_DEPLOYMENT_SECRET/" /home/ubuntu/.s3cfg
sudo sed -i -r "s/(gpg_passphrase *= *).*/\1$S3_DEPLOYMENT_PASSPHRASE/" /home/ubuntu/.s3cfg
## ------ END:    UserData:   Setup - .s3cfg file (the S3 configuration) ------ ##