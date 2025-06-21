package sdu.backend.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import sdu.backend.model.Ad;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdDTO {
    private String id;
    private String name;
    private String description;
    private String link;
    private List<String> pictures;
    private List<String> videos;

    // Static method to convert from entity to DTO
    public static AdDTO fromEntity(Ad ad) {
        return AdDTO.builder()
                .id(ad.getId())
                .name(ad.getName())
                .description(ad.getDescription())
                .link(ad.getLink())
                .pictures(ad.getPictures())
                .videos(ad.getVideos())
                .build();
    }
}