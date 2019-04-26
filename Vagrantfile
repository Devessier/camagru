Vagrant.configure("2") do |config|
    config.vm.box = "debian/stretch64"
    config.vm.synced_folder ".", "/git"
    config.vm.provision :shell, path: "install.sh"
    config.vm.network "forwarded_port", guest: 8000, host: 8000
    config.vm.network "forwarded_port", guest: 8001, host: 8001
end
