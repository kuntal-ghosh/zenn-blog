#!/bin/bash

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Create directory for the application
mkdir -p ~/blog-site

# Clone the repository (you'll need to replace with your actual repo URL)
# git clone https://github.com/yourusername/blog-site.git ~/blog-site

# Navigate to the project directory
cd ~/blog-site

# Install dependencies
npm ci

# Set up environment variables (replace these with your actual values)
cat > .env << EOL
NODE_ENV=production
# Add your other environment variables here
# DATABASE_URL=your_database_url
# NEXTAUTH_URL=your_nextauth_url
# NEXTAUTH_SECRET=your_nextauth_secret
EOL

# Build the application
npm run build

# Set up PM2 to start on boot
pm2 start npm --name "blog-site" -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Optional: Set up Nginx as a reverse proxy
# sudo apt install -y nginx
# sudo cp nginx.conf /etc/nginx/sites-available/blog-site
# sudo ln -s /etc/nginx/sites-available/blog-site /etc/nginx/sites-enabled/
# sudo nginx -t
# sudo systemctl restart nginx

echo "EC2 setup complete!"