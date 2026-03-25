import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'real', nullable: true })
  rating?: number;

  @Column({ type: 'varchar', nullable: true })
  director?: string;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  tags?: string[];

  @Column({ type: 'varchar', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: true })
  cover?: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedule?: ScheduleEntity[];
}
