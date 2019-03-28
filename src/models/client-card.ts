import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClientCard {
  @PrimaryGeneratedColumn("uuid")
  rowId: string;

  @Column()
  clientId: string;

  @Column({
    nullable: true
  })
  cardNumber: string;

  @Column({
    nullable: true
  })
  rfid: string;

  @Column()
  pin: string;

  @Column()
  isActivated: boolean;
}