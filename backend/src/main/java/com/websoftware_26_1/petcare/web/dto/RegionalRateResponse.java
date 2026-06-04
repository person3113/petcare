package com.websoftware_26_1.petcare.web.dto;

public class RegionalRateResponse {
    private String regionName;
    private int totalRescued;
    private int totalAdopted;
    private int totalEuthanized;
    private double adoptionRate;
    private double euthanasiaRate;

    public RegionalRateResponse(String regionName, int totalRescued, int totalAdopted, int totalEuthanized, double adoptionRate, double euthanasiaRate) {
        this.regionName = regionName;
        this.totalRescued = totalRescued;
        this.totalAdopted = totalAdopted;
        this.totalEuthanized = totalEuthanized;
        this.adoptionRate = adoptionRate;
        this.euthanasiaRate = euthanasiaRate;
    }

    public String getRegionName() {
        return regionName;
    }

    public int getTotalRescued() {
        return totalRescued;
    }

    public int getTotalAdopted() {
        return totalAdopted;
    }

    public int getTotalEuthanized() {
        return totalEuthanized;
    }

    public double getAdoptionRate() {
        return adoptionRate;
    }

    public double getEuthanasiaRate() {
        return euthanasiaRate;
    }
}
