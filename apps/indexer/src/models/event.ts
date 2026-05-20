// src/models/SolToken.ts
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column()
//   name!: string;

//   @Column()
//   email!: string;
// }

@Entity("token", {schema: "public"})
export class Token {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    chain_id!: string;
    @Column()
    token_name!: string;
    @Column()
    token_ticker?: string;
    @Column()
    token_logo?: string;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    auction_time?: bigint;
    @Column()
    token_address!: string;
    @Column()
    pair_address!: string
    @Column()
    creator_address!: string;
    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    total_supply?: bigint;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_releasePerBlock?: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    start_block?: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_released?: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    end_block?: bigint;


}

@Entity("trade", {schema: "public"})
export class Trade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token_address!: string;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    trade_amount!: bigint;

    @Column()
    chain_id!: string;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_amount!: bigint;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    slot!: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    native_reserves!: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_reserves!: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_releasePerSlot!: bigint;

    @Column()
    act!: number;
    @Column({
        type: 'numeric',
        precision: 5, // 总共 4 位数字
        scale: 2      // 小数点后 2 位
    })
    usd_price!: number;

    @Column()
    creator_address!: string;

    @Column()
    tx_hash!: string;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    fee?: bigint;
    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;
    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;
}

@Entity("holders", {schema: "public"})
export class Holders {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token_address!: string;


    @Column()
    creator_address!: string;


    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    balance!: bigint;
    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    token_balance!: bigint;


    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    cost!: bigint;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    sold!: bigint;


    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;
}

@Entity("trade_log", {schema: "public"})
export class TradeLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    tx_hash!: string;

    @Column()
    creator_address!: string;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    trade_volume!: bigint;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    rewards!: number;

    @Column({
        type: 'bigint', transformer: {
            to: (value: number) => value.toString(),
            from: (value: string) => parseInt(value, 10)
        }
    })
    created_time!: bigint;
}

@Entity("invitation_log", {schema: "public"})
export class InvitationLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    creator_address!: string;


    @Column()
    invited_address!: string;

    @Column({type:"int8"})
    rewards!: number;

    @Column()
    type!: number;
    @Column({type:"int8"})
    created_time!: number;
}

@Entity("members", {schema: "public"})
export class members {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    creator_address!: string;

    @Column()
    invite_code!: string;

    @Column()
    invited_code!: string;
}