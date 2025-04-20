package sdu.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sdu.backend.model.Ad;
import sdu.backend.repository.AdRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;
    private final MongoTemplate mongoTemplate;
    private final AdStorageService adStorageService;

    private final String baseUrl = "https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/";
    private final String bucketName = "my-data";

    // Create ad
    public Ad createAd(String name, String description, String link, List<MultipartFile> pictures,
                       List<MultipartFile> videos, List<String> existingPictures, List<String> existingVideos) {
        validateInput(name, description, link, pictures, videos, existingPictures, existingVideos);

        Ad ad = new Ad();
        ad.setName(name);
        ad.setDescription(description);
        ad.setLink(link);

        // Process pictures and videos
        List<String> pictureUrls = new ArrayList<>();
        List<String> pictureFileNames = new ArrayList<>();
        processFiles(pictures, existingPictures, pictureUrls, pictureFileNames);
        ad.setPictures(pictureUrls);
        ad.setPictureFileNames(pictureFileNames);

        List<String> videoUrls = new ArrayList<>();
        List<String> videoFileNames = new ArrayList<>();
        processFiles(videos, existingVideos, videoUrls, videoFileNames);
        ad.setVideos(videoUrls);
        ad.setVideoFileNames(videoFileNames);

        return adRepository.save(ad);
    }

    // Update ad
    public Ad updateAd(String id, String name, String description, String link, List<MultipartFile> pictures,
                       List<MultipartFile> videos, List<String> existingPictures, List<String> existingVideos) {
        validateInput(name, description, link, pictures, videos, existingPictures, existingVideos);

        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ad not found with ID: " + id));

        ad.setName(name);
        ad.setDescription(description);
        ad.setLink(link);

        // Process pictures and videos
        List<String> pictureUrls = new ArrayList<>();
        List<String> pictureFileNames = new ArrayList<>();

        // Delete old pictures that are not in existingPictures
        if (ad.getPictureFileNames() != null) {
            for (int i = 0; i < ad.getPictureFileNames().size(); i++) {
                String fileName = ad.getPictureFileNames().get(i);
                String url = ad.getPictures().get(i);
                if (existingPictures == null || !existingPictures.contains(url)) {
                    adStorageService.deleteFile(fileName);
                } else {
                    pictureUrls.add(url);
                    pictureFileNames.add(fileName);
                }
            }
        }

        // Process new pictures
        processFiles(pictures, null, pictureUrls, pictureFileNames);
        ad.setPictures(pictureUrls);
        ad.setPictureFileNames(pictureFileNames);

        // Similar process for videos
        List<String> videoUrls = new ArrayList<>();
        List<String> videoFileNames = new ArrayList<>();

        // Delete old videos that are not in existingVideos
        if (ad.getVideoFileNames() != null) {
            for (int i = 0; i < ad.getVideoFileNames().size(); i++) {
                String fileName = ad.getVideoFileNames().get(i);
                String url = ad.getVideos().get(i);
                if (existingVideos == null || !existingVideos.contains(url)) {
                    adStorageService.deleteFile(fileName);
                } else {
                    videoUrls.add(url);
                    videoFileNames.add(fileName);
                }
            }
        }

        // Process new videos
        processFiles(videos, null, videoUrls, videoFileNames);
        ad.setVideos(videoUrls);
        ad.setVideoFileNames(videoFileNames);

        return adRepository.save(ad);
    }

    // Helper method to process files
    private void processFiles(List<MultipartFile> newFiles, List<String> existingUrls,
                              List<String> resultUrls, List<String> resultFileNames) {
        // Add existing URLs
        if (existingUrls != null) {
            resultUrls.addAll(existingUrls);
            // We don't have filenames for existing URLs that weren't uploaded through our system
            for (int i = 0; i < existingUrls.size(); i++) {
                resultFileNames.add(null);
            }
        }

        // Process new files
        if (newFiles != null && !newFiles.isEmpty()) {
            try {
                for (MultipartFile file : newFiles) {
                    if (!file.isEmpty()) {
                        AdStorageService.UploadResult result = adStorageService.uploadFile(file);
                        resultUrls.add(result.getUrl());
                        resultFileNames.add(result.getFileName());
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to store file: " + e.getMessage());
            }
        }
    }

    // Validate input
    private void validateInput(String name, String description, String link, List<MultipartFile> pictures,
                               List<MultipartFile> videos, List<String> existingPictures, List<String> existingVideos) {
        if (name == null || name.trim().isEmpty() || name.length() < 2 || name.length() > 100) {
            throw new IllegalArgumentException("Name must be between 2 and 100 characters");
        }
        if (description == null || description.trim().isEmpty() || description.length() < 10 || description.length() > 1000) {
            throw new IllegalArgumentException("Description must be between 10 and 1000 characters");
        }
        if (link == null || link.trim().isEmpty()) {
            throw new IllegalArgumentException("Link is required");
        }
        boolean hasNewMedia = (pictures != null && !pictures.isEmpty()) || (videos != null && !videos.isEmpty());
        boolean hasExistingMedia = (existingPictures != null && !existingPictures.isEmpty()) ||
                (existingVideos != null && !existingVideos.isEmpty());
        if (!hasNewMedia && !hasExistingMedia) {
            throw new IllegalArgumentException("At least one picture or video must be provided");
        }
    }

    // Get all ads
    public List<Ad> getAllAds() {
        return adRepository.findAll();
    }

    // Get random ad
    public Ad getRandomAd() {
        SampleOperation sampleStage = Aggregation.sample(1);
        Aggregation aggregation = Aggregation.newAggregation(sampleStage);
        AggregationResults<Ad> results = mongoTemplate.aggregate(aggregation, "ads", Ad.class);
        List<Ad> randomAd = results.getMappedResults();
        if (randomAd.isEmpty()) {
            throw new IllegalStateException("No ads available");
        }
        return randomAd.get(0);
    }

    // Get ad by ID
    public Ad getAdById(String id) {
        return adRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ad not found with ID: " + id));
    }

    // Delete ad
    public void deleteAd(String id) {
        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ad not found with ID: " + id));

        // Delete associated files
        if (ad.getPictureFileNames() != null) {
            for (String fileName : ad.getPictureFileNames()) {
                if (fileName != null) {
                    adStorageService.deleteFile(fileName);
                }
            }
        }
        if (ad.getVideoFileNames() != null) {
            for (String fileName : ad.getVideoFileNames()) {
                if (fileName != null) {
                    adStorageService.deleteFile(fileName);
                }
            }
        }

        adRepository.deleteById(id);
    }
}