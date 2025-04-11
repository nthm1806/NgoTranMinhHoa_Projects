
import { Layout, Menu } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import './styles.css'
import { getListCategory } from '../../service/category';
const { Sider } = Layout;

export const MenuPolicySearch = ({policySearch, categories,handleGetPolicy }) => {

  const [collapsed, setCollapsed] = useState(false);
  // const [categories, setCategories] = useState([]);
  
    // const handleGetData = async() =>{
    //   setCollapsed(true)
    //   const res = await sea();
    //     setCategories(res.data[0])
    //     setCollapsed(false)
    // }
    // useEffect(()=>{
    //     handleGetData()
    // },[])

  const renderItem = useMemo(() =>{
    if(categories){
      return categories.map((i, index) =>({
        key: index,
        icon: '',
        label: <p style={{fontSize: 14}}>{i.categoryTitle}</p>,
       
        children: i?.list.map(policy=> (
          {
            label: policy.policyTitle,
            key: policy.policyId,
            onClick:() =>{
              handleGetPolicy(
                {
                  policyId: policy.policyId
                }
              )
              
            },
          }
        ))
        
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