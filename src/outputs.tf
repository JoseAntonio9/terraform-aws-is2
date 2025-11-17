output "alb_dns_name" {
  description = "El DNS público del Application Load Balancer."
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "El endpoint de la base de datos RDS."
  value       = aws_db_instance.main.endpoint
}

output "ecr_repository_url" {
  description = "La URL del repositorio ECR para subir imágenes Docker."
  value       = aws_ecr_repository.main.repository_url
}

output "ec2_front_public_ip" {
  description = "IP pública de la instancia EC2 'front' (para SSH)."
  value       = aws_instance.front.public_ip
}

output "ec2_back_public_ip" {
  description = "IP pública de la instancia EC2 'back' (para SSH)."
  value       = aws_instance.back.public_ip
}

output "ssh_private_key_pem" {
  description = "La llave privada PEM generada por Terraform para conectar por SSH."
  value       = tls_private_key.ssh_front.private_key_pem
  sensitive   = true
}
