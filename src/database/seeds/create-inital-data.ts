//seeds를 이용하여 데이터를 넣는다. 경로는 설정에 따라 달라진다.

import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Workspaces } from "../../entities/Workspaces";
import { Channels } from "../../entities/Channels";

export class CreateInitalData implements  Seeder{

  //미리 데이터를 넣는다
 public  async run(factory: Factory, connection: Connection): Promise<any> {
      await connection.createQueryBuilder()
        .insert()
        .into(Workspaces)
        .values([{
          id: 1 ,
          name : 'sleact' ,
          url : 'sleact'
      }])
        .execute();

   await connection.createQueryBuilder()
     .insert()
     .into(Channels)
     .values([{
       id: 1 ,
       name : '일반' ,
       WorkspaceId : 1,
       private : false

     }])
     .execute()
  }

}
