import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id', referencedColumnName: 'id' })
  film: FilmEntity;

  @Column({ type: 'timestamptz' })
  daytime: Date;

  @Column({ type: 'varchar' })
  hall: string;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  taken: string[];
}
