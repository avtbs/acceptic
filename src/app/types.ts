export type HealthItem = {
    healthIndex: number;
    endDate?: string;
    minValueDateTime?: string;
    type?: string;
    cowId?: string;
    animalId?: string;
    eventId?: string;
    deletable?: string;
    lactationNumber?: string;
    daysInLactation?: string;
    ageInDays?: string;
    startDateTime?: string;
    reportingDateTime?: string;
};

export type HealthData = {
    offset: number;
    limit: number;
    total: number;
    result: Array<HealthItem>;
}