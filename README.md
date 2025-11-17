# Práctica 4: Infraestructura con Terraform - Ingeniería de Software II

Este repositorio contiene el código de Terraform para desplegar una arquitectura web de dos capas en AWS, como parte de la Práctica 4 de la materia de Ingeniería de Software II.

## Arquitectura

La infraestructura desplegada consiste en:
- Una **VPC** con subredes públicas y privadas para aislar los recursos.
- Un **Application Load Balancer (ALB)** como único punto de entrada a la aplicación.
- Dos **Instancias EC2** (Frontend y Backend) en subredes públicas, con Docker preinstalado.
- Una base de datos **PostgreSQL en RDS** protegida en una subred privada.
- Un repositorio **ECR** para alojar las imágenes Docker de la aplicación.
- **Grupos de Seguridad** que actúan como firewall para controlar el tráfico entre los componentes.

## Prerrequisitos

- Tener una cuenta de AWS con credenciales configuradas.
- Instalar y configurar [AWS CLI](https://aws.amazon.com/cli/).
- Instalar [Terraform](https://www.terraform.io/downloads.html) (versión 1.0 o superior).

## Uso

#### 1. Clonar el repositorio
```bash
git clone https://github.com/JoseAntonio9/terraform-aws-is2.git
cd terraform-aws-is2
```

#### 2. Configurar la contraseña de la base de datos
Crea un archivo llamado `terraform.tfvars`. Este archivo es para tus variables locales y sensibles, y está intencionadamente ignorado por Git para evitar subir datos secretos al repositorio.
```hcl
# Archivo: terraform.tfvars
db_password = "ContraseñaSeguraPersonalizada"
```

#### 3. Inicializar Terraform
Este comando descarga los plugins necesarios para los proveedores (AWS, TLS).
```bash
terraform init
```

#### 4. Planificar la infraestructura
Verifica los cambios que Terraform va a realizar sin aplicar nada todavía. Es un paso de seguridad.
```bash
terraform plan
```

#### 5. Crear la infraestructura
Aplica la configuración para construir todos los recursos en AWS. Deberás confirmar la acción escribiendo `yes`.
```bash
terraform apply
```

## Salidas de la Infraestructura

Una vez que `terraform apply` termine, mostrará una serie de salidas (`outputs`) con información importante para acceder a tus recursos:

- `alb_dns_name`: La URL pública de tu aplicación. Puedes pegarla en un navegador para acceder al balanceador de carga.
- `ec2_front_public_ip` y `ec2_back_public_ip`: Las direcciones IP públicas de tus instancias EC2, usadas para conectar por SSH.
- `rds_endpoint`: El "hostname" de la base de datos para que tu aplicación se conecte a ella.
- `ssh_private_key_pem`: La llave SSH privada generada por Terraform. **Es muy importante que sea guardada en un lugar seguro.**

## Acceso a las Instancias (SSH)

Para conectarte a tus instancias EC2 y verificar que Docker está instalado, sigue estos pasos:

1.  Después de ejecutar `terraform apply`, copia la llave privada que aparece en la salida `ssh_private_key_pem`.

2.  Guarda el contenido de la llave en un archivo en tu máquina local. Por ejemplo, `mi-llave.pem`.

3.  Cambia los permisos del archivo de la llave para hacerlo seguro.
    ```bash
    chmod 400 mi-llave.pem
    ```

4.  Usa el siguiente comando para conectarte, reemplazando `<IP-PUBLICA-DE-LA-INSTANCIA>` con la salida de `ec2_front_public_ip` o `ec2_back_public_ip`.
    ```bash
    ssh -i "mi-llave.pem" ec2-user@<IP-PUBLICA-DE-LA-INSTANCIA>
    ```
---

## Limpieza

Para eliminar **todos** los recursos creados por Terraform y evitar generar costos inesperados, ejecuta el siguiente comando. Deberás confirmar la acción escribiendo `yes`.
```bash
terraform destroy
```

## Equipo de Desarrollo
- García Hernández José Antonio
- Aguilar Uribe José David
- [Jose Manuel]
- [Yair]
