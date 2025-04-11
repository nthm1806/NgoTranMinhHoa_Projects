import { LayoutCommon } from '../../layout/layout-common/LayoutCommon';
import styles from './styles.module.css';

import React, { useEffect, useState } from 'react';
import { Radio, Space, Tabs } from 'antd';
import { Collapse } from 'antd';
import { getCategoryPolicy, searchPolicy } from '../../service/policy';
import { MenuPolicySearch } from './MenuSearch';
import parse from 'html-react-parser'
import { stringify } from 'querystring';


const Search = ({handleGetPolicy}) =>{
   
  return (
    <form className={styles.form}>
      <button className={styles.button}>
        <svg
          width="17"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search"
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            stroke-width="1.333"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <input
        className={styles.input}
        placeholder="Type your text"
        required
        type="text"
        onChange={(e) => setTimeout(()=>{
            handleGetPolicy(({policyId: 0, keyword: e.target.value}))
        }, 700)}
      />
      <button className={styles.reset} type="reset">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </form>
  );
    
}
export const Policy = () => {
    const [categories, setCategories] = useState([])
    const [policy, setPolicy] = useState(null)
    const [policySearch, setPolicySearch] = useState({
        policyId: 0,
        keyword: ''
    })

    const handleGetCategories = async () => {
        try {
            const rs = await getCategoryPolicy();
            console.log(rs);

            const list  = new Map() 
            rs.data?.forEach(i =>{
                if(list.has(i.categoryPolicyId)){
                    const category = list.get(i.categoryPolicyId)

                    const listPolicy = category.list
                    listPolicy.push(i)
                    list.set(i.categoryPolicyId, {...category, list: listPolicy})
                }else{
                    list.set(i.categoryPolicyId, {categoryTitle: i.categoryTitle,categoryId: i.categoryPolicyId, list: [i]})
                }
            })
            const listItem = []
            
            list.forEach((value, key) => {
                listItem.push(value)
            })
            
            setCategories(listItem)
        } catch (error) {
            console.error("error handleGetCategories: ", error);

        }
    }

    const handleGetPolicy = async (param) => {

        try {
            const rs = await searchPolicy(param || {policyId: policySearch.policyId , keyword: policySearch.keyword});
            setPolicy(rs.data?.[0])
        } catch (error) {
            console.error("error handleGetCategories: ", error);

        }
    }

    useEffect(() => {
        handleGetCategories()
        handleGetPolicy({policyId: 1})

    }, [])

    
    return (
        <LayoutCommon>
            <div className={styles.search_form}>
                <h2>Xin chào, Food G5 có thể giúp gì cho bạn?</h2>
                <Search handleGetPolicy={handleGetPolicy}/>
            </div>
            <div className={styles.policy_container}>
                <MenuPolicySearch categories={categories} policySearch={policySearch} handleGetPolicy={handleGetPolicy}/>
                <div className={styles.policy_content}>
                    {parse(policy?.description||'')}
                </div>
            </div>

        </LayoutCommon>
    )
}