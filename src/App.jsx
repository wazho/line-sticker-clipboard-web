// Local modules.
import React, { useState, useCallback } from 'react';
// Styles.
import { Layout, Menu } from 'antd';
import styled from 'styled-components';
import './App.css';
import StickerCollection from './StickerCollection';
import StickerSearcher from './StickerSearcher';

const tabs = {
    myStickerCollection: '我的貼圖收藏庫',
    searchMoreStickers: '搜尋其它貼圖',
};

function App(props) {
    const { className } = props;

    const [tab, setTab] = useState(tabs.myStickerCollection);

    const switchTab = useCallback(({ key }) => {
        setTab(key);
    }, []);

    return (
        <div className={className}>
            <Layout>
                <Layout.Header className='top-menu'>
                    <div className={`site-title`}
                        children={`LINE 貼圖隨意貼`}
                    />

                    <Menu theme='dark' mode='horizontal'
                        defaultSelectedKeys={tab}
                        style={{ lineHeight: '64px' }}
                        onSelect={switchTab}
                    >
                        <Menu.Item key={tabs.myStickerCollection}
                            children={tabs.myStickerCollection}
                        />
                        <Menu.Item key={tabs.searchMoreStickers}
                            children={tabs.searchMoreStickers}
                        />
                    </Menu>
                </Layout.Header>

                <Layout.Content
                    style={{
                        background: '#fff',
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    {tab === tabs.myStickerCollection &&
                        <StickerCollection />
                    }

                    {tab === tabs.searchMoreStickers &&
                        <StickerSearcher />
                    }
                </Layout.Content>

                <Layout.Footer>
                    {`Design by Salmon (salmon.tw)`}
                </Layout.Footer>
            </Layout>
        </div>
    );
}

const styledApp = styled(App)`
    .top-menu * {
        display: inline-block;

        &.site-title {
            color: #00c300;
            font-size: 1.15em;
            margin-right: 2em;
        }
    }
`;

export default styledApp;
