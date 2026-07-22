package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Slider;

public record SliderDto(String title, String subtitle, String imageUrl,
                        String imageAlt, String linkUrl) {
    public static SliderDto of(Slider s) {
        return new SliderDto(s.getTitle(), s.getSubtitle(), s.getImageUrl(),
                s.getImageAlt(), s.getLinkUrl());
    }
}
