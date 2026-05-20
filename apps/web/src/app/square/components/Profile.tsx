/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useCopy } from '@/hooks/useCopy';
import { getProfileInfoByMemberName, getProfileInfoById, MemberInfo } from '@/services/api/square';
import useStore from '@/store/zustand';
import { Images } from '@/utils/imagesMap';
import { useRequest, useSafeState } from 'ahooks';
import Image from 'next/image';
import React, { useEffect } from 'react';
import EditModal from './EditModal';
import { openExplorer } from '@/utils/common';
import { useParams, useRouter } from 'next/navigation';

type Props = {};

const Profile = (props: Props) => {
    const { memberName } = useParams();
    const [profileInfo, setProfileInfo] = useSafeState<MemberInfo>();

    const loginId = useStore((state) => state.loginId);
    const { run: runGetProfileInfoByMemberName } = useRequest(getProfileInfoByMemberName, {
        manual: true,
        onSuccess(res) {
            setProfileInfo(res);
        },
    });
    const { run: runGetProfileInfoById } = useRequest(getProfileInfoById, {
        manual: true,
        onSuccess(res) {
            setProfileInfo(res);
        },
    });
    const { copy } = useCopy();
    const [editModalVisible, setEditModalVisible] = useSafeState(false);
    const router = useRouter();

    useEffect(() => {
        if (memberName) {
            runGetProfileInfoByMemberName(`${memberName}`);
            return;
        }
        if (loginId !== undefined) runGetProfileInfoById(`${loginId}`);
    }, [loginId, memberName]);

    return (
        <div>
            <div className="flex justify-between"></div>
            <div className="p-6">
                <i
                    className="pi pi-angle-left cursor-pointer rounded-full p-1 hover:bg-[#2c3138]"
                    style={{ fontSize: '1.5rem' }}
                    onClick={() => router.back()}
                ></i>
                <div className="flex justify-between">
                    <Image
                        src={profileInfo?.members?.pictureUrl || Images.SQUARE.DEFAULT_AVATAR_PNG}
                        width={106}
                        height={106}
                        className="overflow-hidden rounded-full"
                        alt="icon"
                    />
                    {loginId !== undefined && !memberName && (
                        <div
                            onClick={() => setEditModalVisible(true)}
                            className="flex h-8 w-[70px] cursor-pointer items-center justify-center rounded-sm bg-[#2B3139] text-sm font-bold text-[#fff] hover:bg-[#FFD41A] hover:text-[#333]"
                        >
                            Edit
                        </div>
                    )}
                </div>
                {(loginId !== undefined || memberName) && (
                    <h3 className="text-[20px] font-bold">
                        {profileInfo?.members?.memberName || profileInfo?.members?.creatorAddress.slice(0, 6)}
                    </h3>
                )}
                {(loginId !== undefined || memberName) && (
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-[#848E9C]">{profileInfo?.members?.creatorAddress}</p>
                        <i
                            className="pi pi-clone hover:text-[#FFD41A]"
                            style={{ cursor: 'pointer', fontSize: 12 }}
                            onClick={() => copy(profileInfo?.members?.creatorAddress || '')}
                        />
                        <i
                            className="pi pi-external-link hover:text-[#FFD41A]"
                            style={{ cursor: 'pointer', fontSize: 12 }}
                            onClick={() => openExplorer(profileInfo?.members?.creatorAddress || '', 'address')}
                        />
                        {/* <Image src={Images.SQUARE.COPY_SVG} width={20} height={20} alt="copy" className="cursor-pointer" /> */}
                        {/* <Image src={Images.SQUARE.LINK_SVG} width={20} height={20} alt="link" className="cursor-pointer" /> */}
                    </div>
                )}
                <div className="mt-2 flex items-center gap-6 text-xs text-[#848E9C]">
                    <div>
                        <span className="text-[#fff]">{profileInfo?.members?.following || 0}</span> Following
                    </div>
                    <div>
                        <span className="text-[#fff]">{profileInfo?.members?.followers || 0}</span> Followers
                    </div>
                    <div>
                        <span className="text-[#fff]">{profileInfo?.members?.created || 0}</span> Created
                    </div>
                    <div>
                        <span className="text-[#fff]">{profileInfo?.members?.holding || 0}</span> Holding
                    </div>
                </div>
            </div>
            <div className="flex h-[56px] items-center border-[1px] border-[#2B3139] pl-6 font-bold">All Content</div>
            <div>
                <div className="flex justify-center">
                    <Image src={Images.SQUARE.EMPTY_SVG} height={108} width={108} alt="empty" className="mt-[126px]" />
                </div>
                <div className="mb-96 mt-3 text-center text-xs text-[#848E9C]">No data</div>
            </div>
            <EditModal
                visibleController={{ value: editModalVisible, onChange: setEditModalVisible }}
                updateUserInfo={memberName ? runGetProfileInfoByMemberName : runGetProfileInfoById}
                currentUserInfo={profileInfo?.members}
            />
        </div>
    );
};

export default Profile;
