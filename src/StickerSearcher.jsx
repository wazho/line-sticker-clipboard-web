// Local modules.
import React, { useState, useEffect, useCallback } from 'react';
import { stringify } from 'query-string';
// Styles.
import { Input, Card, Row, Col, Divider } from 'antd';
import './App.css';
// Local modules.
import SticketPicker from './SticketPicker';

const apiUrl = `https://asia-east2-line-sticker-fetcher.cloudfunctions.net`;

function StickerSearcher(props) {
    const [term, setTerm] = useState('咖波');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stickerResourceType, setStickerResourceType] = useState(null);

    const handleOpenProduction = useCallback((productId, stickerResourceType) => {
        setSelectedProduct(productId);
        setStickerResourceType(stickerResourceType);
    }, []);

    useEffect(() => {
        const querystring = stringify({
            query: term,
            limit: 50,
        });
        const url = `${apiUrl}/search-products?${querystring}`;

        fetch(url)
            .then((res) => res.json())
            .then((json) => setProducts(json.items));
    }, [term]);

    return (
        <>
            <Input.Search size='large'
                enterButton={`搜尋貼圖`}
                defaultValue={term}
                onSearch={(value) => setTerm(value)}
            />

            <Divider />

            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col key={product.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                        <Card hoverable size='small'
                            cover={<img alt={product.title} src={product.listIcon.src} />}
                            style={{ minWidth: 150 }}
                            onClick={handleOpenProduction.bind(this, product.id, product.stickerResourceType)}
                        >
                            <Card.Meta title={product.title} description={product.authorName} />
                        </Card>
                    </Col>
                ))}
            </Row>

            <SticketPicker productId={selectedProduct} stickerResourceType={stickerResourceType} />
        </>
    );
}

export default StickerSearcher;
