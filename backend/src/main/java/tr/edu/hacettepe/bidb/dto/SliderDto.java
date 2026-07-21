package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Slider;

public record SliderDto(String baslik, String altBaslik, String gorselUrl,
                        String gorselAlt, String baglanti) {
    public static SliderDto of(Slider s) {
        return new SliderDto(s.getBaslik(), s.getAltBaslik(), s.getGorselUrl(),
                s.getGorselAlt(), s.getBaglanti());
    }
}
