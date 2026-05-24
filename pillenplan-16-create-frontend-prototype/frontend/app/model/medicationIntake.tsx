import Medikament from "./medikament"

export enum Wiederholung{
    täglich,
    wöchentlich,
    zweiwöchentlich
}

export default class MedicationIntake {
    id!: string
    medikament!: Medikament
    plannedIntake!: Date
    actualIntake!: Date | null
    wiederholung!: Wiederholung | undefined
    anzahlPillen!: number
}