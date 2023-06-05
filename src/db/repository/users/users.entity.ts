import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('Users')
export class UsersEntity {
  @PrimaryColumn({length: 255})
  id: string;

  @Column({length: 255})
  password: string;

  @Column({
    length: 255,
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'datetime',
  })
  created_at: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  updated_at: Date;
}
