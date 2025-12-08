# Práctica 5: Despliegue Continuo (CD), IPs Elásticas y Dominios en AWS

Este repositorio contiene la infraestructura como código (Terraform) y los flujos de automatización (GitHub Actions) para desplegar una arquitectura web robusta y resiliente en AWS para la aplicación **TaskFlow**.

Esta práctica evoluciona la arquitectura anterior implementando **IPs Estáticas**, **Gestión de DNS** y un pipeline de **Integración y Despliegue Continuo (CI/CD)**.

## Arquitectura Evolucionada

La infraestructura se compone de:

*   **Red (VPC):** Subredes públicas y privadas en múltiples AZs.
*   **Persistencia de Red:** **Elastic IPs (EIP)** para garantizar que las direcciones IP de los servidores no cambien, incluso si se recrean.
*   **DNS (Route 53):** Zona alojada gestionada por código que apunta el dominio personalizado a las IPs Elásticas.
*   **Cómputo:** Instancias **EC2** configuradas con `user_data` para aprovisionamiento automático de Docker.
*   **CI/CD:** Pipeline de **GitHub Actions** que construye, sube imágenes a **ECR** y despliega automáticamente en EC2.
*   **Base de Datos:** RDS PostgreSQL aislado en subred privada.

## Prerrequisitos

*   Cuenta de AWS activa.
*   [Terraform](https://www.terraform.io/) instalado.
*   Dominio comprado en Namecheap (o similar).
*   Acceso al repositorio de GitHub para configurar secretos.

---

## Guía de Despliegue

### Fase 1: Infraestructura (Terraform)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JoseAntonio9/terraform-aws-is2.git
    cd terraform-aws-is2/src
    ```

2.  **Configurar variables:**
    Crea o edita el archivo `terraform.tfvars`:
    ```hcl
    db_password = "TuContraseñaSegura123!"
    domain_name = "equipo-ids2-ciencias.xyz"
    ```

3.  **Inicializar y Aplicar:**
    ```bash
    terraform init
    terraform apply
    # Escribe 'yes' para confirmar
    ```
    *Nota: Esto creará las IPs Elásticas y la Zona DNS.*

4.  **Obtener Datos Críticos (Outputs):**
    Al finalizar, Terraform mostrará los `nameservers`. **Cópialos**.

### Fase 2: Configuración de DNS (Manual)

1.  Ve a tu panel de administración de dominio (ej. Namecheap).
2.  Busca la configuración de **Nameservers**.
3.  Selecciona "Custom DNS".
4.  Ingresa los 4 servidores que te devolvió el output de Terraform (`aws_route53_zone`).
5.  Guarda los cambios.

### Fase 3: Configuración del Pipeline (CI/CD)

Para que GitHub Actions pueda desplegar, ve a **Settings > Secrets and variables > Actions** en tu repositorio y agrega:

| Secreto | Valor | Fuente |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | Tu Access Key | IAM AWS |
| `AWS_SECRET_ACCESS_KEY` | Tu Secret Key | IAM AWS |
| `DB_PASSWORD` | Contraseña de la BD | Tu `terraform.tfvars` |
| `RDS_ENDPOINT` | Endpoint de Postgres | Output `rds_endpoint` |
| `EC2_FRONT_HOST` | IP Elástica del Front | Output `ec2_front_eip` |
| `EC2_BACK_HOST` | IP Elástica del Back | Output `ec2_back_eip` |
| `SSH_PRIVATE_KEY` | Contenido de tu `.pem` | Output `ssh_private_key_pem` |

### Fase 4: Despliegue Automático

Ya no es necesario entrar manualmente a los servidores.

1.  Realiza cualquier cambio en el código (Frontend, Backend o Infra).
2.  Haz un push a la rama `main`.
3.  Ve a la pestaña **Actions** en GitHub.
4.  El pipeline se ejecutará: construirá las imágenes, las subirá a ECR y actualizará los servidores automáticamente.

---

## Verificación

Una vez finalizado el pipeline y propagado el DNS (puede tardar unos minutos), accede a tu aplicación mediante tu dominio personalizado:

**Frontend:** `http://www.equipo-ids2-ciencias.xyz` o `http://equipo-ids2-ciencias.xyz`
**Backend API:** `http://api.equipo-ids2-ciencias.xyz/api/health`

---

## Limpieza (Destroy)

1.  Elimina manualmente las imágenes del repositorio ECR desde la consola de AWS.
2.  Ejecuta:
    ```bash
    terraform destroy
    ```

## Equipo de Desarrollo

- García Hernández José Antonio
- Aguilar Uribe José David
