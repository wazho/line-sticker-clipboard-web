// Node modules.
import React, { useState, useEffect, useCallback } from 'react';
import { stringify } from 'query-string';
// import copyToClipboard from 'clipboard-copy';
// Styles.
import { Modal, Avatar, Row, Col, notification, Divider, Button } from 'antd';
import styled from 'styled-components';
// Local modules.
import { imageToBlob } from './utils/image';

const apiUrl = `https://asia-east2-line-sticker-fetcher.cloudfunctions.net`;

function SticketPicker(props) {
    const { className, productId, stickerResourceType } = props;

    const [selectedType, setSelectType] = useState('static');
    const [visible, setVisible] = useState(false);
    const [stickers, setStickers] = useState([]);

    const handleClose = useCallback(() => {
        setVisible(false);
    }, []);

    const handleCopy = useCallback(async (imageUrl) => {
        // const text = `![](${imageUrl} =100x)`;
        // copyToClipboard(text);
        const blob = await imageToBlob(imageUrl)
        const item = new window.ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);

        notification.success({
            message: `複製成功`,
            description: `已經將語法複製到剪貼簿囉！`,
            placement: 'bottomRight',
        })
    }, []);

    useEffect(() => {
        const querystring = stringify({
            productId,
        });
        const url = `${apiUrl}/get-stickers?${querystring}`;

        setStickers({});
        fetch(url)
            .then((res) => res.json())
            .then((list) => {
                if (/ANIMATION/.test(stickerResourceType)) {
                    const animatedStickers = list.map((item) => item.replace('sticker.png', 'sticker_animation.png'));
                    setStickers({ static: list, animation: animatedStickers });
                } else {
                    setStickers({ static: list });
                }
            });

        // Show modal.
        setVisible(!!productId);
    }, [productId, stickerResourceType]);

    return (
        <Modal className={className} width={800}
            visible={visible}
            title={`選擇喜歡的貼圖`}
            footer={null}
            onCancel={handleClose}
        >
            <Button.Group>
                {stickers.static &&
                    <Button type={selectedType === 'static' ? 'primary' : 'default'} size='large'
                        children={`靜態貼圖`}
                        onClick={setSelectType.bind(null, 'static')}
                    />
                }
                {stickers.animation &&
                    <Button type={selectedType === 'animation' ? 'primary' : 'default'} size='large'
                        children={`動態貼圖`}
                        onClick={setSelectType.bind(null, 'animation')}
                    />
                }
            </Button.Group>

            <Divider />

            <p>{`點擊將貼圖加入至蒐藏庫當中`}</p>

            <Row gutter={[16, 16]}>
                {stickers[selectedType] && stickers[selectedType].map((sticker, i) => (
                    <Col key={i} xs={12} sm={8} md={6} lg={6} xl={6}
                        onClick={handleCopy.bind(null, sticker)}
                    >
                        <Avatar className='sticker' shape='square' size={128} src={sticker} />
                    </Col>
                ))}
            </Row>
        </Modal>
    );
}

const styledSticketPicker = styled(SticketPicker)`
    .sticker {
        cursor: pointer;
    }
`;

export default styledSticketPicker;
