import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
