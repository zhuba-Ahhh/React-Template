/**文档说明
 * @Description: 接口返回值类型声明文档
 * @author Ywj
 * @Email 3477826311@qq.com
 */

/** 定义基本的接口返回体  每个业务 公司可能定义的后端返回体不一样 这里大都需要修改*/
export interface resBaseInfo<DataModel> {
  rsCode: string;
  rsCause: string;
  data: DataModel;
}

/** 一个示例 表示返回 */
export interface GetCityTotalNumberModel {
  city: string;
  peoplesOfLogin: number;
}

export type GetCityTotal = GetCityTotalNumberModel[];
