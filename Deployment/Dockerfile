# Use a base image with the necessary dependencies
FROM ubuntu:latest

# Install Terraform
RUN apt-get update && apt-get install -y wget unzip
RUN wget https://releases.hashicorp.com/terraform/1.0.1/terraform_1.0.1_linux_amd64.zip
RUN unzip terraform_1.0.1_linux_amd64.zip
RUN mv terraform /usr/local/bin/

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Run terraform init to download the necessary plugins
RUN terraform init

# Make port 80 available to the world outside this container
EXPOSE 80

# Run terraform apply when the container launches
CMD ["terraform", "apply", "-auto-approve"]

