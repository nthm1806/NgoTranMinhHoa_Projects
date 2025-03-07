
import { Layout, Menu } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import './styles.css'
import { getListCategory } from '../../service/category';
const { Sider } = Layout;

export const MenuSearch = ({setValueFilter}) => {

  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  
    const handleGetData = async() =>{
      setCollapsed(true)
      const res = await getListCategory();
        setCategories(res.data[0])
        setCollapsed(false)
    }
    useEffect(()=>{
        handleGetData()
    },[])

  const renderItem = useMemo(() =>{
    if(categories){
      return categories.map((i, index) =>({
        key: index,
        icon: '',
        label: i.Category,
        onClick:() =>{
          setValueFilter({
            categoryName: i.Category
          })
          
        }
      }))
    }
    return []
  },[categories])

  return (<Sider trigger={null} collapsible collapsed={collapsed} className='side-bar-search' width={250}>
    <div className="demo-logo-vertical" />
    <Menu
      className='menu-side-bar-search'
      theme="dark"
      mode="inline"
      items={renderItem}
      
    />
  </Sider>)
}