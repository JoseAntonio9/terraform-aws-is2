# Práctica 4: Infraestructura en AWS con Terraform - Ingeniería de Software II

Este repositorio contiene el código de **Infrastructure as Code (IaC)** para desplegar una arquitectura web de alta disponibilidad en AWS. La práctica incluye la configuración de red, cómputo, base de datos y almacenamiento de contenedores para alojar la aplicación **TaskFlow**.

## Arquitectura Desplegada

La infraestructura se compone de los siguientes recursos:

*   **Red (VPC):** Subredes públicas (para balanceador y servidores web) y privadas (para base de datos) en múltiples zonas de disponibilidad.
*   **Acceso:** Un **Application Load Balancer (ALB)** que distribuye el tráfico entre las instancias.
*   **Cómputo:** Dos instancias **EC2 (Amazon Linux 2)** con Docker preinstalado, configuradas para alta disponibilidad.
*   **Datos:** Una base de datos **PostgreSQL en RDS**, aislada en la red privada.
*   **Artefactos:** Un repositorio **ECR** para alojar las imágenes Docker del Frontend y Backend.
*   **Seguridad:** Grupos de seguridad estrictos (El backend solo acepta tráfico del frontend, la BD solo del backend).

## Prerrequisitos

*   Cuenta de AWS activa.
*   [AWS CLI](https://aws.amazon.com/cli/) instalado y configurado (`aws configure`).
*   [Terraform](https://www.terraform.io/) instalado.
*   [Docker](https://www.docker.com/) instalado localmente (para construir las imágenes).
*   Código fuente de la aplicación (Frontend y Backend).

---

## Guía de Despliegue

### Fase 1: Provisionamiento de Infraestructura (Terraform)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JoseAntonio9/terraform-aws-is2.git
    cd terraform-aws-is2/src
    ```

2.  **Configurar secretos:**
    Crea un archivo `terraform.tfvars` (ignorado por git) para definir la contraseña de la base de datos:
    ```hcl
    db_password = "TuContraseñaSegura123!"
    ```

3.  **Inicializar y Aplicar:**
    ```bash
    terraform init
    terraform apply
    # Escribe 'yes' para confirmar
    ```

4.  **Guardar las Salidas (Outputs):**
    Al finalizar, Terraform mostrará datos críticos. **Guárdalos**, los necesitarás para la Fase 2.
    *   `alb_dns_name`: URL de la aplicación.
    *   `ecr_repository_url`: URL del repositorio de imágenes.
    *   `rds_endpoint`: Dirección de la base de datos.
    *   `ec2_front_public_ip` y `ec2_back_public_ip`: IPs para acceso SSH.

5.  **Extraer la Llave SSH:**
    Ejecuta este comando para guardar la llave privada generada y darle los permisos correctos:
    ```bash
    terraform output -raw ssh_private_key_pem > ../mi-llave.pem
    chmod 400 ../mi-llave.pem
    ```

---

### Fase 2: Construcción y Publicación de Imágenes (Docker)

Desde tu máquina local, debes construir las imágenes y subirlas a AWS ECR.

1.  **Iniciar sesión en ECR:**
    ```bash
    # Reemplaza <REGION> y <ECR_URL> con tus valores (ej: us-east-1 y la salida de terraform)
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URL>
    ```

2.  **Backend (Flask):**
    ```bash
    cdruta/al/backend
    docker build -t taskflow-backend .
    docker tag taskflow-backend:latest <ECR_URL>:backend
    docker push <ECR_URL>:backend
    ```

3.  **Frontend (React + Nginx):**
    Es importante pasar la variable de entorno para la API durante el build.
    ```bash
    cd ruta/al/frontend
    docker build --build-arg REACT_APP_API_URL=/api -t taskflow-frontend .
    docker tag taskflow-frontend:latest <ECR_URL>:frontend
    docker push <ECR_URL>:frontend
    ```

---

### Fase 3: Ejecución en Servidores (SSH)

Debes realizar estos pasos en **AMBAS** instancias EC2 (`front` y `back`) para lograr la alta disponibilidad.

1.  **Conectarse por SSH:**
    ```bash
    ssh -i "../mi-llave.pem" ec2-user@<IP_PUBLICA_INSTANCIA>
    ```

2.  **Configurar credenciales en la instancia:**
    La primera vez, la instancia necesita permisos para descargar de ECR.
    ```bash
    aws configure
    # Ingresa tus Access Key ID, Secret Key y región (us-east-1)
    ```

3.  **Iniciar sesión en Docker (dentro de la instancia):**
    ```bash
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URL>
    ```

4.  **Ejecutar Backend:**
    ```bash
    docker run -d --name backend --restart always -p 5000:5000 \
      -e DATABASE_URL="postgresql://dbadmin:<DB_PASSWORD>@<RDS_ENDPOINT>/miappdb" \
      <ECR_URL>:backend
    ```

5.  **Ejecutar Frontend:**
    ```bash
    docker run -d --name frontend --restart always --network host \
      <ECR_URL>:frontend
    ```

---

## Verificación

Una vez desplegado en ambas instancias, accede a la aplicación a través del Balanceador de Carga:

**URL:** `http://<ALB_DNS_NAME>`

Deberás ver nuestra aplicación TaskFlow funcionando. El tráfico será balanceado automáticamente entre ambas instancias.

---

## Limpieza (Destroy)

Para evitar costos, elimina la infraestructura cuando no la necesites.

1.  **Importante:** Primero vacía el repositorio ECR manualmente desde la consola de AWS o usando CLI (Terraform fallará si el repo tiene imágenes).
2.  Ejecuta la destrucción:
    ```bash
    terraform destroy
    # Escribe 'yes' para confirmar
    ```

## Equipo de Desarrollo

- García Hernández José Antonio
- Aguilar Uribe José David
