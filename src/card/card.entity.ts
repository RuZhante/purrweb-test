import { ColumnEntity } from 'src/column/column.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cards' })
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => ColumnEntity, (column) => column.cards)
  column: ColumnEntity;

  @ManyToOne(() => UserEntity, (user) => user.cards, { eager: true })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.card)
  comments: CommentEntity[];
}
