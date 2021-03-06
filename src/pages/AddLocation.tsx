import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonInput, IonItemGroup, IonItemDivider, IonDatetime } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import LocationService from '../services/location.service';
import './AddLocation.css'

declare const daum: any;
declare const kakao: any;

export const AddLocation: React.FC<RouteComponentProps> = ({ history }) => {
    const [address, setAddress] = React.useState<any>({
        value: '',
        showPostcode: false
    });
    const name = React.useRef<any>();
    const detailAddress = React.useRef<any>();
    const nParkingLot = React.useRef<any>();
    const price = React.useRef<any>();
    const startDttm = React.useRef<any>();
    const endDttm = React.useRef<any>();
    const layer = React.useRef<any>();

    const searchAddress = () => {
        setAddress({
            showPostcode: true,
            value: address.value
        });
        new daum.Postcode({
            oncomplete: (data: any) => {
                setAddress({
                    showPostcode: false,
                    value: data.address
                });
            },
            width: '100vw'
        }).embed(layer.current);
    }

    const addLocation = () => {
        let geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, async (data: any) => {
            if (data.length > 0) {
                await LocationService.addLocation({
                    name: name.current.value,
                    address: address + ' ' + detailAddress.current.value,
                    lat: parseFloat(data[0].y),
                    lng: parseFloat(data[0].x),
                    nParkingLot: nParkingLot.current.value,
                    pricePerUnit: price.current.value,
                    startDttm: startDttm.current.value,
                    endDttm: endDttm.current.value
                });

                history.goBack();
            }
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>주차공간등록</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill="clear" onClick={addLocation}>등록</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div ref={layer} className='postcode'></div>
                {!address.showPostcode ? (<IonList>
                    <IonItemGroup>
                        <IonItemDivider>
                            <IonLabel>기본정보</IonLabel>
                        </IonItemDivider>
                        <IonItem>
                            <IonLabel>
                                주차장이름
                            </IonLabel>
                            <IonInput ref={name} placeholder="주차장 이름을 입력하세요.."></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                주소
                                {address.value ? (<p>{address.value}</p>) : null}
                            </IonLabel>
                            <IonButton onClick={searchAddress}>검색</IonButton>
                        </IonItem>
                        {address ? (<IonItem>
                            <IonLabel>
                                상세주소
                            </IonLabel>
                            <IonInput ref={detailAddress} placeholder="상세주소를 입력하세요.."></IonInput>
                        </IonItem>) : null}
                        <IonItem>
                            <IonLabel>
                                주차가능차량수
                            </IonLabel>
                            <IonInput ref={nParkingLot} placeholder="주차가능 차랑수를 입력하세요.." type="number"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                10분당가격
                            </IonLabel>
                            <IonInput ref={price} placeholder="가격을 입력하세요.." type="number"></IonInput>
                        </IonItem>
                    </IonItemGroup>
                    <IonItemGroup>
                        <IonItemDivider>
                            <IonLabel>주차가능시간</IonLabel>
                        </IonItemDivider>
                        <IonItem>
                            <IonLabel>
                                시작시간
                            </IonLabel>
                            <IonDatetime ref={startDttm} displayFormat="h:mm a"></IonDatetime>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                종료시간
                            </IonLabel>
                            <IonDatetime ref={endDttm} displayFormat="h:mm a"></IonDatetime>
                        </IonItem>
                    </IonItemGroup>
                </IonList>) : null}

            </IonContent>
        </IonPage>
    )
};