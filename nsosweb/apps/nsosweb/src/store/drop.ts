import { defineStore } from 'pinia';
import { getDropData } from '#/api';

export const useDropStore = defineStore('nsos-drop', () => {
  
  const dropData: any = {};

  /**
   * 初始化下拉数据，缓存不存在就从后台获取
   * @param drops
   */
  async function initDrops(drops: string[]) {
    if (drops) {
      let dropNames = '';
      drops.forEach((d) => {
        if (!dropData[d]) {
          dropNames += d + ',';
        }
      });
      if (dropNames.length > 0) {
        const dropInfo = await getDropData(
          dropNames.substring(0, dropNames.length - 1),
        );
        setDropData(dropInfo);
      }
    }
  }

  /**
   * 刷新缓存中的下拉数据
   * @param drops
   */
  async function refreshDrops(drops: string[]) {
    if (drops) {
      let dropNames = '';
      drops.forEach((d) => {
        dropNames += d + ',';
      });
      if (dropNames.length > 0) {
        const dropInfo = await getDropData(
          dropNames.substring(0, dropNames.length - 1),
        );
        setDropData(dropInfo);
      }
    }
  }

  function setDropData(dropInfo: any) {
    if (dropInfo) {
      for (let k in dropInfo) {
        dropData[k] = dropInfo[k];
      }
    }
  }

  function get(dropList:any, dropNames: string[]){
    if (dropNames) {
      dropNames.forEach(d => {
        dropList[d] = dropData[d]
      })
    }
  }
  function $reset() {

  }
  return {initDrops, refreshDrops, get, $reset};
});
