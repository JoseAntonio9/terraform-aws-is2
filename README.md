# Practica de Infraestructura con Terraform - Ingeniería de Software II

Este repositorio contiene el código de Terraform para desplegar una arquitectura web de dos capas en AWS, como parte de la Práctica 4 de Ingeniería de Software II.

## Arquitectura

La infraestructura desplegada consiste en:
- Una **VPC** con subredes públicas y privadas.
- Un **Application Load Balancer (ALB)** como punto de entrada.
- Dos **Instancias EC2** (Frontend y Backend) en una subred pública.
- Una base de datos **PostgreSQL en RDS** en una subred privada.
- Un repositorio **ECR** para las imágenes Docker de la aplicación.
- **Grupos de Seguridad** para controlar el tráfico entre los componentes.


## Prerrequisitos

- Tener una cuenta de AWS.
- Instalar y configurar [AWS CLI](https://aws.amazon.com/cli/).
- Instalar [Terraform](https://www.terraform.io/downloads.html).

## Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/terraform-aws-is2.git
    cd terraform-aws-is2
    ```

2.  **Configurar variables:**
    Crea un archivo llamado `terraform.tfvars` (este archivo será ignorado por Git) y define las variables necesarias, especialmente las sensibles.
    ```hcl
    db_password = "UnaContraseñaMuySegura123!"
    ```

3.  **Inicializar Terraform:**
    Descarga los plugins necesarios para los proveedores (AWS, TLS).
    ```bash
    terraform init
    ```

4.  **Planificar la infraestructura:**
    Verifica los cambios que Terraform va a realizar.
    ```bash
    terraform plan
    ```

5.  **Aplicar los cambios:**
    Crea la infraestructura en AWS.
    ```bash
    terraform apply
    ```

6.  **Destruir la infraestructura:**
    Para eliminar todos los recursos creados y no generar costos.
    ```bash
    terraform destroy
    ```

## Equipo de Desarrollo

- [García Hernández José Antonio]
- [Aguilar Uribe José David]
- [Evangelista Tiburcio José Manuel]
- [Correa Trejo Yair Uriel]
