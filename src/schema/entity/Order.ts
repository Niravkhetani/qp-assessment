import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import {GroceryItems} from "./GroceryItems";
import {Users} from "./User";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order_total_amount: number;

  @Column()
  amount: number;

  // Establishing many-to-many relationship with Role entity
  @ManyToMany(() => GroceryItems, (groceryItem) => groceryItem.id)
  @JoinTable()
  items: GroceryItems[];

  // Establishing one-to-one relationship with Profile entity
  @ManyToMany(() => Users, (user) => user.id)
  @JoinTable()
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
