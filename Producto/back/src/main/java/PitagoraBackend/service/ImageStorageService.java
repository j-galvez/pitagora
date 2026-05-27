package PitagoraBackend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Value("${gcp.config.path}")
    private String configPath;

    private final ResourceLoader resourceLoader;

    public ImageStorageService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public String subirImagen(MultipartFile archivo) throws IOException {
        // Cargar credenciales dinámicamente
        Resource resource = resourceLoader.getResource(configPath);
        Storage storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                .build()
                .getService();

        // Generar un nombre único para evitar sobreescritura
        String nombreUnico = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();

        // Configurar los metadatos
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, nombreUnico)
                .setContentType(archivo.getContentType())
                .build();

        // Subir a GCP Storage
        storage.create(blobInfo, archivo.getBytes());

        // Retornar la URL pública estática generada
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, nombreUnico);
    }
}