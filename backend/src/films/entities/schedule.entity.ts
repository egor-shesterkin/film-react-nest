import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', name: 'film_id' })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id', referencedColumnName: 'id' })
  film: FilmEntity;

  @Column({ type: 'timestamptz', nullable: true })
  daytime?: string;

  @Column({ type: 'varchar', nullable: true })
  hall?: string;

  @Column({ type: 'integer', nullable: true })
  rows?: number;

  @Column({ type: 'integer', nullable: true })
  seats?: number;

  @Column({ type: 'integer', nullable: true })
  price?: number;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  taken?: string[];
}
