
adduser newuser
# https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-ubuntu-20-04
sudo usermod -aG sudo newuser

# https://www.digitalocean.com/community/tutorials/how-to-enable-remote-desktop-protocol-using-xrdp-on-ubuntu-22-04
sudo apt install xrdp -y
sudo systemctl status xrdp # check it's running

echo xfce4-session >~/.xsession

sudo service xrdp restart