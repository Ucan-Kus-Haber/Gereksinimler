package sdu.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sdu.backend.model.Ad;
import sdu.backend.service.AdService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173",
        "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174"})
public class AdController {

    private final AdService adService;

    // Create ad
    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createAd(
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("link") String link,
            @RequestPart(value = "pictures", required = false) List<MultipartFile> pictures,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos,
            @RequestPart(value = "existingPictures", required = false) List<String> existingPictures,
            @RequestPart(value = "existingVideos", required = false) List<String> existingVideos) {
        try {
            Ad ad = adService.createAd(name, description, link, pictures, videos, existingPictures, existingVideos);
            return new ResponseEntity<>(ad, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating ad: " + e.getMessage()));
        }
    }

    // Get all ads
    @GetMapping
    public ResponseEntity<List<Ad>> getAllAds() {
        return ResponseEntity.ok(adService.getAllAds());
    }

    // Get random ad
    @GetMapping("/random")
    public ResponseEntity<?> getRandomAd() {
        try {
            Ad ad = adService.getRandomAd();
            return ResponseEntity.ok(ad);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Get ad by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdById(@PathVariable String id) {
        try {
            Ad ad = adService.getAdById(id);
            return ResponseEntity.ok(ad);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Update ad
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateAd(
            @PathVariable String id,
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("link") String link,
            @RequestPart(value = "pictures", required = false) List<MultipartFile> pictures,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos,
            @RequestPart(value = "existingPictures", required = false) List<String> existingPictures,
            @RequestPart(value = "existingVideos", required = false) List<String> existingVideos) {
        try {
            Ad ad = adService.updateAd(id, name, description, link, pictures, videos, existingPictures, existingVideos);
            return ResponseEntity.ok(ad);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating ad: " + e.getMessage()));
        }
    }

    // Delete ad
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAd(@PathVariable String id) {
        try {
            adService.deleteAd(id);
            return ResponseEntity.ok(Map.of("message", "Ad deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting ad: " + e.getMessage()));
        }
    }
}