/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-shadow */
import ExtendedImage from '@/components/Create/ExtendedImage';
import { useBoolean, useControllableValue, useMemoizedFn, useRequest, useSetState } from 'ahooks';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import React, { useLayoutEffect, useRef } from 'react';
import { Image as PrImage } from 'primereact/image';
import { Images } from '@/utils/imagesMap';
import { InputText } from 'primereact/inputtext';
import { editProfileInfo } from '@/services/api/square';
import useStore from '@/store/zustand';
import { useToast } from '@/context/ToastContext';

type Props = {
    visibleController: { value: boolean; onChange: any };
    updateUserInfo: any;
    currentUserInfo:
        | {
              chainID: string;
              createdAt: number;
              creatorAddress: string;
              id: number;
              memberName: string;
              memberStatus: number;
              pictureUrl: string;
              updatedAt: number;
              followers: number;
              following: number;
              holding: number;
              created: number;
          }
        | undefined;
};
type FormValues = {
    memberName: string;
    pictureUrl: string;
    intro: string;
};
const initialFormValues = {
    memberName: '',
    pictureUrl: '',
    intro: '',
};
const emptyTemplate = <div className="rounded-full bg-[#2B3139] sm:h-[72px] sm:w-[72px]"></div>;

const EditModal = ({ visibleController, updateUserInfo, currentUserInfo }: Props) => {
    const { showToast } = useToast();
    const chooseOptions = {
        icon: (
            <div>
                <PrImage
                    src={currentUserInfo?.pictureUrl ? currentUserInfo.pictureUrl : Images.SQUARE.DEFAULT_AVATAR_SVG}
                    width="72"
                    height="72"
                    alt="img"
                    className="absolute left-[50%] top-0 -ml-[36px] rounded-full bg-[#2B3139]"
                />
            </div>
        ),
        iconOnly: true,
        className: 'custom-choose-btn p-button-outlined h-[72px] w-[72px] relative rounded-full',
    };

    const loginId = useStore((state) => state.loginId);
    const [visible, setVisible] = useControllableValue(visibleController);
    const [formValues, setFormValues] = useSetState<FormValues>(initialFormValues);
    const [avatarIsLoading, { setFalse: setAvatarIsLoadingFalse, setTrue: setAvatarIsLoadingTrue }] = useBoolean(false);
    const [isLayoutFilled, { setTrue: setIsLayoutFilledTrue }] = useBoolean(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const validateCreateForm = (formValues: FormValues): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        if (currentUserInfo?.pictureUrl && !formValues.pictureUrl) {
            errors.push('Avatar has not changed.');
        }
        if (!currentUserInfo?.pictureUrl && !formValues.pictureUrl) {
            errors.push('Avatar is required.');
        }
        if (!formValues.memberName) {
            errors.push('Nick name is required.');
        }
        return {
            isValid: errors.length === 0 && !avatarIsLoading,
            errors,
        };
    };
    const { isValid, errors } = validateCreateForm(formValues);

    const onUpload = useMemoizedFn((event: FileUploadUploadEvent) => {
        setAvatarIsLoadingTrue();
        const file = event.files[0];
        const res = JSON.parse(event.xhr.response);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormValues({ pictureUrl: res?.data?.fileUrl || '' });
            };
            reader.readAsDataURL(file);
        }
        setAvatarIsLoadingFalse();
    });

    const onClear = () => {
        setFormValues({ pictureUrl: '' });
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const { run: editConfirm } = useRequest(editProfileInfo, {
        manual: true,
        onSuccess() {
            setVisible(false);
            updateUserInfo(`${loginId}`);
        },
    });

    useLayoutEffect(() => {
        setIsLayoutFilledTrue();
    }, [isLayoutFilled]);

    return (
        <Dialog
            header="Edit Profile"
            headerStyle={{
                backgroundColor: '#1E2329',
                color: '#fff',
                fontSize: '14px',
            }}
            draggable={false}
            contentStyle={{ backgroundColor: '#1E2329' }}
            visible={visible}
            style={{
                width: '360px',
                backgroundColor: '#1E2329',
            }}
            onHide={() => {
                if (!visible) return;
                setFormValues({ pictureUrl: '', memberName: '' });
                setVisible(false);
            }}
        >
            <div>
                <div className="mb-[68px] flex items-center gap-[45px] text-xs font-bold text-[#fff]">
                    <div className="flex w-[62px] items-center">
                        Avatar <span className="text-[#FF3B54]">*</span>
                    </div>
                    {!formValues.pictureUrl ? (
                        <FileUpload
                            disabled={avatarIsLoading}
                            ref={fileUploadRef}
                            mode="basic"
                            name="file"
                            url="/api/v1/uploadFile/logo"
                            accept="image/*"
                            maxFileSize={4000000}
                            onUpload={onUpload}
                            auto
                            headerStyle={{ width: 72, height: 72 }}
                            chooseOptions={chooseOptions}
                            emptyTemplate={emptyTemplate}
                        />
                    ) : (
                        <div className="h-[72px] w-[72px] overflow-hidden rounded-full">
                            <ExtendedImage
                                src={formValues.pictureUrl}
                                alt="Uploaded"
                                width="72"
                                height="72"
                                preview
                                onPreviewClick={onClear}
                            />
                        </div>
                    )}
                </div>
                <div className="mb-[68px] flex items-center gap-[45px] text-xs font-bold text-[#fff]">
                    <div className="flex w-[62px] items-center">
                        Nickname <span className="text-[#FF3B54]">*</span>
                    </div>
                    <InputText
                        placeholder={currentUserInfo?.memberName}
                        value={formValues.memberName}
                        className="h-[44px] w-[244px] border-[1px] border-[#2B3139] bg-[#1E2329] pl-1 focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                        onChange={(e) => {
                            const newValue = e.target.value.replace(/^\s+|\s+$/g, '').slice(0, 60);
                            setFormValues((prev) => ({ ...prev, memberName: newValue }));
                        }}
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div
                        onClick={() => {
                            setFormValues({ pictureUrl: '', memberName: '' });
                            setVisible(false);
                        }}
                        className="flex h-[40px] w-[156px] cursor-pointer items-center justify-center rounded-[3px] bg-[#2B3139] text-sm text-[#fff]"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={() => {
                            if (!isValid) {
                                const error1 = errors?.[0];
                                const error2 = errors?.[1];
                                showToast({
                                    severity: 'info',
                                    summary: 'Tips',
                                    detail: (
                                        <>
                                            <div className="mb-2">{error1}</div>
                                            <div>{error2}</div>
                                        </>
                                    ),
                                    position: 'bottom-right',
                                    life: 3000,
                                });
                                return;
                            }
                            if (loginId === undefined) return;
                            editConfirm({ ...formValues, id: loginId });
                        }}
                        className={`flex h-[40px] w-[156px] cursor-pointer items-center justify-center rounded-[3px] bg-[#FFD41A] text-sm font-bold text-[#333]`}
                    >
                        Save
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default EditModal;
